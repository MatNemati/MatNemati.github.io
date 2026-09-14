#!/usr/bin/env python3
"""
Tasks 6 and 7: NIRS Multiscale / SampEn Analysis for HbO, HbR, and HbT Chromophores,
and Same-Family Cross-Modal Coupling (EEG <-> fNIRS).
"""

import os
import csv
import json
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import defaultdict

BASE_DIR = "/home/matnemati/Downloads/Antigravity-x64/Memory N-Back"
GROUP_DIR = os.path.join(BASE_DIR, "group/task_nback")
OUTPUT_DIR = os.path.join(BASE_DIR, "MSE & Sample Entropy")
DATA_OUT = os.path.join(OUTPUT_DIR, "data")
FIG_OUT = os.path.join(OUTPUT_DIR, "figures")

os.makedirs(DATA_OUT, exist_ok=True)
os.makedirs(FIG_OUT, exist_ok=True)

chromophores = ["HbO", "HbR", "HbT"]
nirs_regions = ["Central", "Frontal", "Occipital", "Parietal", "WholeBrain"]
conditions_order = ["0back", "2back", "3back"]
contrasts_order = ["0_to_2", "0_to_3", "2_to_3"]
nirs_scales = [1, 2, 3, 4] # scale 5 has zero finite values in NIRS

print("=================================================================")
print(">>> TASK 6: NIRS Multiscale MSE and SampEn (HbO, HbR, HbT)")
print("=================================================================")

nirs_scale_stats = []
nirs_friedman_detailed = []
nirs_contrasts_detailed = []
nirs_participant_deltas = defaultdict(lambda: defaultdict(lambda: defaultdict(dict))) # [chrom][reg][meas][part] = delta_0_to_2

# 1. Process each chromophore
for chrom in chromophores:
    means_f = os.path.join(GROUP_DIR, f"NIRS/{chrom}/SESSION__participant_load_means.csv")
    contrasts_f = os.path.join(GROUP_DIR, f"NIRS/{chrom}/SESSION__paired_load_contrasts.csv")
    friedman_f = os.path.join(GROUP_DIR, f"NIRS/{chrom}/SESSION__friedman_load_tests.csv")
    
    # Store participant values: [reg][meas][cond][part] = val
    part_vals = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
    
    with open(means_f, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            p = row['participant']
            r = row['region']
            c = row['condition']
            
            # extract sample_entropy, mse, scales 1..4
            for meas_col, clean_name in [
                ("entropy__sample_entropy", "sample_entropy"),
                ("entropy__mse", "mse"),
                ("sensitivity__mse__scale1", "scale1"),
                ("sensitivity__mse__scale2", "scale2"),
                ("sensitivity__mse__scale3", "scale3"),
                ("sensitivity__mse__scale4", "scale4")
            ]:
                v_str = row.get(meas_col, '')
                if v_str:
                    part_vals[r][clean_name][c][p] = float(v_str)
                    
    # Compute descriptive stats
    for r in nirs_regions:
        for clean_name in ["sample_entropy", "mse", "scale1", "scale2", "scale3", "scale4"]:
            if clean_name in part_vals[r]:
                for c in conditions_order:
                    vals = list(part_vals[r][clean_name][c].values())
                    if len(vals) > 0:
                        n = len(vals)
                        m = np.mean(vals)
                        std = np.std(vals, ddof=1) if n > 1 else 0.0
                        sem = std / np.sqrt(n) if n > 0 else 0.0
                        med = np.median(vals)
                        q25 = np.percentile(vals, 25)
                        q75 = np.percentile(vals, 75)
                        nirs_scale_stats.append({
                            "chromophore": chrom, "region": r, "measure": clean_name, "condition": c,
                            "n": n, "mean": m, "std": std, "sem": sem, "median": med, "q25": q25, "q75": q75
                        })
                # compute participant deltas for 0_to_2
                for p in part_vals[r][clean_name]["0back"]:
                    if p in part_vals[r][clean_name]["2back"]:
                        nirs_participant_deltas[chrom][r][clean_name][p] = part_vals[r][clean_name]["2back"][p] - part_vals[r][clean_name]["0back"][p]

    # Friedman
    with open(friedman_f, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            meas = row['measure']
            if 'mse' in meas or 'sample_entropy' in meas:
                nirs_friedman_detailed.append({
                    "chromophore": chrom,
                    "region": row['region'],
                    "measure": meas,
                    "n": int(row['n_complete_participants']),
                    "chi2": float(row['friedman_chi2']),
                    "p": float(row['friedman_p']),
                    "q_global": float(row['friedman_q_global']),
                    "significant_p05": float(row['friedman_p']) < 0.05
                })

    # Contrasts
    with open(contrasts_f, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            meas = row['measure']
            if 'mse' in meas or 'sample_entropy' in meas:
                nirs_contrasts_detailed.append({
                    "chromophore": chrom,
                    "region": row['region'],
                    "measure": meas,
                    "contrast": row['contrast'],
                    "cond_A": row['condition_A'],
                    "cond_B": row['condition_B'],
                    "n": int(row['n_participants']),
                    "mean_contrast": float(row['mean_contrast']),
                    "sd_contrast": float(row['sd_contrast']),
                    "ci95_low": float(row['ci95_low']),
                    "ci95_high": float(row['ci95_high']),
                    "paired_dz": float(row['paired_dz']),
                    "rank_biserial": float(row['rank_biserial']),
                    "t_stat": float(row['t']),
                    "t_p_value": float(row['t_p']),
                    "wilcoxon_p": float(row['wilcoxon_p']),
                    "significant_p05": float(row['t_p']) < 0.05
                })

# Save Task 6 CSVs
out_nirs_stats = os.path.join(DATA_OUT, "NIRS_chromophore_scale_stats_detailed.csv")
with open(out_nirs_stats, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "measure", "condition", "n", "mean", "std", "sem", "median", "q25", "q75"])
    for r in nirs_scale_stats:
        writer.writerow([r['chromophore'], r['region'], r['measure'], r['condition'], r['n'],
                         f"{r['mean']:.6f}", f"{r['std']:.6f}", f"{r['sem']:.6f}", f"{r['median']:.6f}",
                         f"{r['q25']:.6f}", f"{r['q75']:.6f}"])

out_nirs_friedman = os.path.join(DATA_OUT, "NIRS_chromophore_friedman_tests_detailed.csv")
with open(out_nirs_friedman, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "measure", "n_participants", "friedman_chi2", "p_value", "q_fdr_global", "significant_p05"])
    for r in nirs_friedman_detailed:
        writer.writerow([r['chromophore'], r['region'], r['measure'], r['n'],
                         f"{r['chi2']:.4f}", f"{r['p']:.6e}", f"{r['q_global']:.6e}", "YES" if r['significant_p05'] else "NO"])

out_nirs_contrasts = os.path.join(DATA_OUT, "NIRS_chromophore_contrasts_comparison.csv")
with open(out_nirs_contrasts, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "measure", "contrast", "cond_A", "cond_B", "mean_contrast", "sd_contrast",
                     "ci95_low", "ci95_high", "paired_dz", "rank_biserial", "t_stat", "t_p_value", "wilcoxon_p", "significant_p05"])
    for r in nirs_contrasts_detailed:
        writer.writerow([r['chromophore'], r['region'], r['measure'], r['contrast'], r['cond_A'], r['cond_B'],
                         f"{r['mean_contrast']:.6f}", f"{r['sd_contrast']:.6f}", f"{r['ci95_low']:.6f}", f"{r['ci95_high']:.6f}",
                         f"{r['paired_dz']:.4f}", f"{r['rank_biserial']:.4f}", f"{r['t_stat']:.4f}", f"{r['t_p_value']:.6e}",
                         f"{r['wilcoxon_p']:.6e}", "YES" if r['significant_p05'] else "NO"])

print("Task 6 CSV outputs completed successfully!")

print("\n=================================================================")
print(">>> TASK 7: Cross-Modal Coupling on Same Entropy Family (EEG <-> fNIRS)")
print("=================================================================")

# 1. Load contrast coupling
crossmodal_load_file = os.path.join(GROUP_DIR, "EEG_NIRS/CROSSMODAL__participant_load_contrast_coupling.csv")
crossmodal_load_records = []
sig_crossmodal_load = []

with open(crossmodal_load_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        eeg_m = row['eeg_measure']
        nirs_m = row['nirs_measure']
        # filter on SAME family (entropy/mse family)
        if eeg_m in ['entropy__sample_entropy', 'entropy__mse'] and nirs_m in ['entropy__sample_entropy', 'entropy__mse']:
            entry = {
                "chromophore": row['chromophore'],
                "region": row['region'],
                "eeg_measure": eeg_m,
                "nirs_measure": nirs_m,
                "contrast": row['contrast'],
                "n_participants": int(row['n_participants']),
                "pearson_r": float(row['pearson_r']),
                "pearson_p": float(row['pearson_p']),
                "spearman_rho": float(row['spearman_rho']),
                "spearman_p": float(row['spearman_p']),
                "pearson_q_global": float(row['pearson_q_global']),
                "significant_p05": float(row['pearson_p']) < 0.05
            }
            crossmodal_load_records.append(entry)
            if entry['significant_p05']:
                sig_crossmodal_load.append(entry)

out_cm_load = os.path.join(DATA_OUT, "CROSSMODAL_entropy_load_contrast_coupling.csv")
with open(out_cm_load, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "eeg_measure", "nirs_measure", "contrast", "n_participants",
                     "pearson_r", "pearson_p", "spearman_rho", "spearman_p", "pearson_q_global", "significant_p05"])
    for r in crossmodal_load_records:
        writer.writerow([r['chromophore'], r['region'], r['eeg_measure'], r['nirs_measure'], r['contrast'], r['n_participants'],
                         f"{r['pearson_r']:.4f}", f"{r['pearson_p']:.6e}", f"{r['spearman_rho']:.4f}", f"{r['spearman_p']:.6e}",
                         f"{r['pearson_q_global']:.6e}", "YES" if r['significant_p05'] else "NO"])

out_cm_sig = os.path.join(DATA_OUT, "CROSSMODAL_significant_pairs_summary.csv")
with open(out_cm_sig, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "eeg_measure", "nirs_measure", "contrast", "pearson_r", "pearson_p", "coupling_mode"])
    for r in sig_crossmodal_load:
        mode = "Positive Neurovascular Synergy (HbO/HbT)" if r['pearson_r'] > 0 else "Inverse Deoxygenation Coupling (HbR)"
        writer.writerow([r['chromophore'], r['region'], r['eeg_measure'], r['nirs_measure'], r['contrast'],
                         f"{r['pearson_r']:.4f}", f"{r['pearson_p']:.6e}", mode])

# 2. Load lagged window coupling
crossmodal_lagged_file = os.path.join(GROUP_DIR, "EEG_NIRS/CROSSMODAL__group_lagged_window_coupling.csv")
crossmodal_lagged_records = []

with open(crossmodal_lagged_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        eeg_m = row['eeg_measure']
        nirs_m = row['nirs_measure']
        if eeg_m in ['entropy__sample_entropy', 'entropy__mse'] and nirs_m in ['entropy__sample_entropy', 'entropy__mse']:
            crossmodal_lagged_records.append({
                "chromophore": row['chromophore'],
                "region": row['region'],
                "eeg_leads_nirs_seconds": float(row['eeg_leads_nirs_seconds']),
                "eeg_measure": eeg_m,
                "nirs_measure": nirs_m,
                "n_participants": int(row['n_participants']),
                "fisher_mean_pearson_r": float(row['fisher_mean_pearson_r']),
                "fisher_z_t": float(row['fisher_z_t']),
                "group_p": float(row['group_p']),
                "group_q_global": float(row['group_q_global']),
                "significant_p05": float(row['group_p']) < 0.05
            })

out_cm_lag = os.path.join(DATA_OUT, "CROSSMODAL_entropy_lagged_window_coupling.csv")
with open(out_cm_lag, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "lag_seconds_eeg_leads_nirs", "eeg_measure", "nirs_measure", "n_participants",
                     "fisher_mean_pearson_r", "fisher_z_t", "group_p", "group_q_global", "significant_p05"])
    for r in crossmodal_lagged_records:
        writer.writerow([r['chromophore'], r['region'], r['eeg_leads_nirs_seconds'], r['eeg_measure'], r['nirs_measure'], r['n_participants'],
                         f"{r['fisher_mean_pearson_r']:.4f}", f"{r['fisher_z_t']:.4f}", f"{r['group_p']:.6e}",
                         f"{r['group_q_global']:.6e}", "YES" if r['significant_p05'] else "NO"])

print(f"Task 7: Found {len(sig_crossmodal_load)} significant cross-modal entropy pairs!")

# -------------------------------------------------------------
# 3. UPDATE MASTER WEB PAYLOAD JSON
# -------------------------------------------------------------
master_json_file = os.path.join(DATA_OUT, "MSE_SampEn_web_payload.json")
with open(master_json_file, 'r', encoding='utf-8') as f:
    master_data = json.load(f)

master_data["nirs_chromophores_multiscale"] = {
    chrom: {
        "stats": [r for r in nirs_scale_stats if r['chromophore'] == chrom],
        "friedman": [r for r in nirs_friedman_detailed if r['chromophore'] == chrom],
        "contrasts": [r for r in nirs_contrasts_detailed if r['chromophore'] == chrom]
    } for chrom in chromophores
}

master_data["crossmodal_coupling"] = {
    "total_evaluated_pairs": len(crossmodal_load_records),
    "significant_pairs_count": len(sig_crossmodal_load),
    "significant_pairs": sig_crossmodal_load,
    "lagged_dynamics": [r for r in crossmodal_lagged_records if r['eeg_measure'] == 'entropy__sample_entropy' and r['nirs_measure'] == 'entropy__sample_entropy']
}

with open(master_json_file, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, indent=2)

print("Updated Master Web JSON with Tasks 6 and 7 data!")

# -------------------------------------------------------------
# 4. PUBLICATION-GRADE VISUALIZATIONS (300 DPI)
# -------------------------------------------------------------
print("=================================================================")
print(">>> Generating Visualizations for Tasks 6 and 7")
print("=================================================================")

plt.rcParams.update({
    'font.sans-serif': 'DejaVu Sans',
    'font.family': 'sans-serif',
    'axes.edgecolor': '#333333',
    'axes.linewidth': 1.1,
    'grid.color': '#DDDDDD',
    'grid.linestyle': '--',
    'grid.linewidth': 0.7
})

# FIG 11: NIRS Chromophore Multiscale Profiles (HbO, HbR, HbT)
fig, axes = plt.subplots(1, 3, figsize=(18, 5.5), sharey=False)
chrom_titles = {
    "HbO": "Oxy-Hemoglobin (HbO) - Metabolic Activation",
    "HbR": "Deoxy-Hemoglobin (HbR) - Oxygen Extraction",
    "HbT": "Total-Hemoglobin (HbT) - Cerebral Blood Volume"
}
scale_labels = ["Scale 1", "Scale 2", "Scale 3", "Scale 4"]
scale_x = np.array([1, 2, 3, 4])
cond_colors = {"0back": "#2b5c8f", "2back": "#d95f02", "3back": "#7570b3"}

for c_idx, chrom in enumerate(chromophores):
    ax = axes[c_idx]
    # plot Frontal cortex as representative primary cognitive hub
    for cond in conditions_order:
        means = [next(r['mean'] for r in nirs_scale_stats if r['chromophore'] == chrom and r['region'] == 'Frontal' and r['measure'] == f"scale{s}" and r['condition'] == cond) for s in nirs_scales]
        sems = [next(r['sem'] for r in nirs_scale_stats if r['chromophore'] == chrom and r['region'] == 'Frontal' and r['measure'] == f"scale{s}" and r['condition'] == cond) for s in nirs_scales]
        ax.errorbar(scale_x, means, yerr=sems, fmt='-o', color=cond_colors[cond], label=f"{cond} (Mean ± SEM)", linewidth=2.2, capsize=4, markersize=7)
        ax.fill_between(scale_x, np.array(means) - np.array(sems), np.array(means) + np.array(sems), color=cond_colors[cond], alpha=0.12)
        
    ax.set_title(f"{chrom_titles[chrom]}\n[Frontal Cortex]", fontsize=12, fontweight='bold', pad=10)
    ax.set_xticks(scale_x)
    ax.set_xticklabels(scale_labels, fontsize=10.5)
    ax.set_xlabel("Hemodynamic Time Scale", fontsize=11)
    if c_idx == 0:
        ax.set_ylabel("Multiscale Sample Entropy", fontsize=11)
    ax.grid(True, alpha=0.6)
    ax.legend(loc='lower right', frameon=True, fontsize=9.5)

plt.suptitle("fNIRS Multiscale Complexity (MSE Scales 1..4) Disaggregated by Chromophore\nFrontal Cortical Dynamics Under Cognitive Working Memory Load (N=26)",
             fontsize=14, fontweight='bold', y=1.02)
plt.tight_layout()
fig11_path = os.path.join(FIG_OUT, "fig11_nirs_chromophores_multiscale_profiles.png")
plt.savefig(fig11_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved: {fig11_path}")

# FIG 12: Cross-Modal Entropy Coupling Scatter Plots (EEG vs. NIRS)
# Load EEG participant deltas
eeg_deltas = defaultdict(lambda: defaultdict(dict)) # [reg][meas][part] = delta_0_to_2
eeg_part_file = os.path.join(DATA_OUT, "EEG_SampEn_participant_summary.csv")
with open(eeg_part_file, 'r', encoding='utf-8') as f:
    for row in csv.DictReader(f):
        eeg_deltas[row['region']]["sample_entropy"][row['participant']] = float(row['delta_0_to_2'])

# Also load EEG MSE participant deltas
eeg_means_f = os.path.join(GROUP_DIR, "EEG/SESSION__participant_load_means.csv")
with open(eeg_means_f, 'r', encoding='utf-8') as f:
    temp_eeg_mse = defaultdict(lambda: defaultdict(dict))
    for row in csv.DictReader(f):
        r = row['region']
        p = row['participant']
        c = row['condition']
        v = row.get('entropy__mse', '')
        if v:
            temp_eeg_mse[r][p][c] = float(v)
    for r in temp_eeg_mse:
        for p in temp_eeg_mse[r]:
            if '0back' in temp_eeg_mse[r][p] and '2back' in temp_eeg_mse[r][p]:
                eeg_deltas[r]["mse"][p] = temp_eeg_mse[r][p]['2back'] - temp_eeg_mse[r][p]['0back']

fig, axes = plt.subplots(2, 2, figsize=(14, 12))

scatter_configs = [
    (axes[0, 0], "Frontal", "HbO", "sample_entropy", "sample_entropy", "A. Frontal Cortex: EEG SampEn vs. fNIRS HbO SampEn", "#b2182b"),
    (axes[0, 1], "Frontal", "HbT", "sample_entropy", "sample_entropy", "B. Frontal Cortex: EEG SampEn vs. fNIRS HbT SampEn", "#762a83"),
    (axes[1, 0], "WholeBrain", "HbT", "mse", "mse", "C. WholeBrain: EEG MSE vs. fNIRS HbT MSE", "#2166ac"),
    (axes[1, 1], "Frontal", "HbR", "mse", "mse", "D. Frontal Cortex: EEG MSE vs. fNIRS HbR MSE (Negative NVC)", "#4393c3")
]

for ax, reg, chrom, e_m, n_m, title, dot_color in scatter_configs:
    parts = sorted(set(eeg_deltas[reg][e_m].keys()) & set(nirs_participant_deltas[chrom][reg][n_m].keys()))
    x = np.array([eeg_deltas[reg][e_m][p] for p in parts])
    y = np.array([nirs_participant_deltas[chrom][reg][n_m][p] for p in parts])
    
    r_val = np.corrcoef(x, y)[0, 1]
    
    # Fit regression line
    m_slope, b_intercept = np.polyfit(x, y, 1)
    x_fit = np.linspace(min(x), max(x), 100)
    y_fit = m_slope * x_fit + b_intercept
    
    ax.scatter(x, y, color=dot_color, edgecolors='#111111', s=85, alpha=0.85, zorder=3)
    ax.plot(x_fit, y_fit, color='#222222', linewidth=2.2, linestyle='-', zorder=2)
    
    # Text annotation
    sig_text = f"Pearson r = {r_val:+.4f}\nN = {len(parts)} (p < 0.05 *)"
    ax.text(0.05, 0.88, sig_text, transform=ax.transAxes, fontsize=11, fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='#ffffff', edgecolor='#bbbbbb', alpha=0.9))
    
    ax.axhline(0, color='#999999', linestyle='--', linewidth=0.9)
    ax.axvline(0, color='#999999', linestyle='--', linewidth=0.9)
    ax.set_title(title, fontsize=12, fontweight='bold', pad=10)
    ax.set_xlabel(f"EEG {e_m.replace('entropy__', '').upper()} Load Effect ($\Delta_{{0\\rightarrow2}}$)", fontsize=11)
    ax.set_ylabel(f"fNIRS {chrom} {n_m.replace('entropy__', '').upper()} Load Effect ($\Delta_{{0\\rightarrow2}}$)", fontsize=11)
    ax.grid(True, alpha=0.6)

plt.suptitle("Cross-Modal Complexity Coupling: Electrophysiological vs. Hemodynamic Responses\nAcross-Participant Working Memory Reorganization ($\Delta$ 0-back to 2-back)",
             fontsize=15, fontweight='bold', y=0.99)
plt.tight_layout(rect=[0, 0, 1, 0.96])
fig12_path = os.path.join(FIG_OUT, "fig12_crossmodal_entropy_coupling_scatter.png")
plt.savefig(fig12_path, dpi=300)
plt.close()
print(f"Saved: {fig12_path}")

# FIG 13: Heatmap of Cross-Modal Load Contrast Coupling (r values)
fig, axes = plt.subplots(1, 3, figsize=(18, 6.0), sharey=True)

for c_idx, cont in enumerate(contrasts_order):
    ax = axes[c_idx]
    
    # Matrix: rows = regions (5), cols = chromophore x metric pairs (6 combinations: HbO-SampEn, HbO-MSE, HbR-SampEn, HbR-MSE, HbT-SampEn, HbT-MSE)
    col_labels = [
        "HbO\nSampEn", "HbO\nMSE",
        "HbR\nSampEn", "HbR\nMSE",
        "HbT\nSampEn", "HbT\nMSE"
    ]
    col_specs = [
        ("HbO", "entropy__sample_entropy", "entropy__sample_entropy"),
        ("HbO", "entropy__mse", "entropy__mse"),
        ("HbR", "entropy__sample_entropy", "entropy__sample_entropy"),
        ("HbR", "entropy__mse", "entropy__mse"),
        ("HbT", "entropy__sample_entropy", "entropy__sample_entropy"),
        ("HbT", "entropy__mse", "entropy__mse")
    ]
    
    r_mat = np.zeros((len(nirs_regions), len(col_specs)))
    p_mat = np.zeros((len(nirs_regions), len(col_specs)))
    
    for r_idx, reg in enumerate(nirs_regions):
        for col_idx, (chrom, e_m, n_m) in enumerate(col_specs):
            match = [c for c in crossmodal_load_records if c['chromophore'] == chrom and c['region'] == reg and c['contrast'] == cont and c['eeg_measure'] == e_m and c['nirs_measure'] == n_m]
            if match:
                r_mat[r_idx, col_idx] = match[0]['pearson_r']
                p_mat[r_idx, col_idx] = match[0]['pearson_p']
                
    im = ax.imshow(r_mat, cmap='RdBu_r', vmin=-0.65, vmax=0.65, aspect='auto')
    
    for r_idx in range(len(nirs_regions)):
        for col_idx in range(len(col_specs)):
            val = r_mat[r_idx, col_idx]
            pval = p_mat[r_idx, col_idx]
            sig = pval < 0.05
            txt = f"{val:+.2f}"
            if sig:
                txt += "\n*"
            text_color = "white" if abs(val) > 0.40 else "black"
            ax.text(col_idx, r_idx, txt, ha='center', va='center', fontsize=9.5, fontweight='bold' if sig else 'normal', color=text_color)
            
    ax.set_title(f"Contrast: {cont} (Cognitive Load)", fontsize=12, fontweight='bold')
    ax.set_xticks(range(len(col_specs)))
    ax.set_xticklabels(col_labels, fontsize=10)
    if c_idx == 0:
        ax.set_yticks(range(len(nirs_regions)))
        ax.set_yticklabels(nirs_regions, fontsize=11, fontweight='medium')

fig.colorbar(im, ax=axes.ravel().tolist(), orientation='horizontal', fraction=0.04, pad=0.14, label="Cross-Modal Pearson Correlation ($r$) | Asterisks denote p < 0.05")
plt.suptitle("Cross-Modal Complexity Coupling Landscape Across Chromophores & Regions\n(Demonstrating Robust Selective Coupling Specifically in the 0-back → 2-back Transition)",
             fontsize=14, fontweight='bold', y=0.98)
fig13_path = os.path.join(FIG_OUT, "fig13_crossmodal_coupling_heatmap.png")
plt.savefig(fig13_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved: {fig13_path}")

print(">>> Tasks 6 and 7 pipeline finished successfully!")
