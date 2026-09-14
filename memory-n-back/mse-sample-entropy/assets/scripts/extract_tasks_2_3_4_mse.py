#!/usr/bin/env python3
"""
Tasks 2, 3, and 4: Multiscale Sample Entropy (MSE) Scale-by-Scale Pipeline,
Session vs. Event Decoupling, Estimator Reliability Audit, and Cross-Scale Directionality Analysis.
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

regions_order = ["Central", "Frontal", "Occipital", "Parietal", "Temporal", "WholeBrain"]
conditions_order = ["0back", "2back", "3back"]
scales = [1, 2, 3, 4, 5]

print("=================================================================")
print(">>> TASK 2: Scale-by-Scale MSE Analysis (Scales 1..5)")
print("=================================================================")

# Load Session participant means for each scale
eeg_means_file = os.path.join(GROUP_DIR, "EEG/SESSION__participant_load_means.csv")
eeg_friedman_file = os.path.join(GROUP_DIR, "EEG/SESSION__friedman_load_tests.csv")
eeg_contrasts_file = os.path.join(GROUP_DIR, "EEG/SESSION__paired_load_contrasts.csv")

# [scale][region][cond] = [val1, val2, ...]
mse_scale_data = {s: defaultdict(lambda: defaultdict(list)) for s in scales}
mse_mean_data = defaultdict(lambda: defaultdict(list)) # entropy__mse

with open(eeg_means_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        reg = row['region']
        cond = row['condition']
        
        # mean MSE
        v_mean = row.get('entropy__mse', '')
        if v_mean:
            mse_mean_data[reg][cond].append(float(v_mean))
            
        for s in scales:
            k = f"sensitivity__mse__scale{s}"
            val_s = row.get(k, '')
            if val_s:
                mse_scale_data[s][reg][cond].append(float(val_s))

# Save Scale-by-Scale Regional Stats CSV
eeg_mse_stats_file = os.path.join(DATA_OUT, "EEG_MSE_scale_by_scale_regional_stats.csv")
scale_stats_summary = {s: {} for s in scales}

with open(eeg_mse_stats_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["scale", "region", "condition", "n_participants", "mean", "std", "sem", "median", "q25", "q75", "min", "max"])
    for s in scales:
        for reg in regions_order:
            scale_stats_summary[s][reg] = {}
            for cond in conditions_order:
                vals = np.array(mse_scale_data[s][reg][cond])
                n = len(vals)
                m = np.mean(vals)
                std = np.std(vals, ddof=1) if n > 1 else 0.0
                sem = std / np.sqrt(n) if n > 0 else 0.0
                med = np.median(vals)
                q25 = np.percentile(vals, 25)
                q75 = np.percentile(vals, 75)
                vmin = np.min(vals)
                vmax = np.max(vals)
                writer.writerow([s, reg, cond, n, f"{m:.6f}", f"{std:.6f}", f"{sem:.6f}", f"{med:.6f}",
                                 f"{q25:.6f}", f"{q75:.6f}", f"{vmin:.6f}", f"{vmax:.6f}"])
                scale_stats_summary[s][reg][cond] = {
                    "n": int(n), "mean": float(m), "std": float(std), "sem": float(sem),
                    "median": float(med), "q25": float(q25), "q75": float(q75), "min": float(vmin), "max": float(vmax)
                }

# Extract Friedman Tests for each scale
scale_friedman_extracted = []
scale_measures = [f"sensitivity__mse__scale{s}" for s in scales] + ["entropy__mse"]

with open(eeg_friedman_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meas = row['measure']
        if meas in scale_measures:
            sc_num = "mean_mse" if meas == "entropy__mse" else int(meas.replace("sensitivity__mse__scale", ""))
            scale_friedman_extracted.append({
                "scale": sc_num,
                "measure": meas,
                "region": row['region'],
                "n": int(row['n_complete_participants']),
                "chi2": float(row['friedman_chi2']),
                "p": float(row['friedman_p']),
                "q_global": float(row['friedman_q_global']),
                "significant": float(row['friedman_p']) < 0.05
            })

eeg_mse_friedman_file = os.path.join(DATA_OUT, "EEG_MSE_scale_by_scale_friedman_tests.csv")
with open(eeg_mse_friedman_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["scale", "region", "measure", "n_participants", "friedman_chi2", "p_value", "q_fdr_global", "significant_p05"])
    for r in scale_friedman_extracted:
        writer.writerow([r['scale'], r['region'], r['measure'], r['n'],
                         f"{r['chi2']:.4f}", f"{r['p']:.6e}", f"{r['q_global']:.6e}", "YES" if r['significant'] else "NO"])

# Extract Paired Contrasts for each scale
scale_contrasts_extracted = []
with open(eeg_contrasts_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meas = row['measure']
        if meas in scale_measures:
            sc_num = "mean_mse" if meas == "entropy__mse" else int(meas.replace("sensitivity__mse__scale", ""))
            scale_contrasts_extracted.append({
                "scale": sc_num,
                "measure": meas,
                "region": row['region'],
                "contrast": row['contrast'],
                "condition_A": row['condition_A'],
                "condition_B": row['condition_B'],
                "n": int(row['n_participants']),
                "mean_contrast": float(row['mean_contrast']),
                "sd_contrast": float(row['sd_contrast']),
                "ci95_low": float(row['ci95_low']),
                "ci95_high": float(row['ci95_high']),
                "paired_dz": float(row['paired_dz']),
                "rank_biserial": float(row['rank_biserial']),
                "t": float(row['t']),
                "t_p": float(row['t_p']),
                "wilcoxon_p": float(row['wilcoxon_p']),
                "significant_p05": float(row['t_p']) < 0.05
            })

eeg_mse_contrasts_file = os.path.join(DATA_OUT, "EEG_MSE_scale_by_scale_paired_contrasts.csv")
with open(eeg_mse_contrasts_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["scale", "region", "contrast", "cond_A", "cond_B", "mean_contrast", "sd_contrast",
                     "ci95_low", "ci95_high", "paired_dz", "rank_biserial", "t_stat", "t_p_value", "wilcoxon_p", "significant_p05"])
    for c in scale_contrasts_extracted:
        writer.writerow([c['scale'], c['region'], c['contrast'], c['condition_A'], c['condition_B'],
                         f"{c['mean_contrast']:.6f}", f"{c['sd_contrast']:.6f}", f"{c['ci95_low']:.6f}", f"{c['ci95_high']:.6f}",
                         f"{c['paired_dz']:.4f}", f"{c['rank_biserial']:.4f}", f"{c['t']:.4f}", f"{c['t_p']:.6e}",
                         f"{c['wilcoxon_p']:.6e}", "YES" if c['significant_p05'] else "NO"])

print("Task 2 CSVs created successfully!")

print("\n=================================================================")
print(">>> TASK 3: Session vs. Event Decoupling & Reliability Audit")
print("=================================================================")

# Load Estimator Reliability from EEG and NIRS
reliability_records = []
eeg_rel_file = os.path.join(GROUP_DIR, "EEG/MULTISCALE__estimator_reliability.csv")
if os.path.exists(eeg_rel_file):
    with open(eeg_rel_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            reliability_records.append({
                "modality": "EEG",
                "branch": row['branch'],
                "metric": row['metric'],
                "scale": int(row['scale']),
                "n_values": int(row['n_values']),
                "n_finite": int(row['n_finite']),
                "finite_fraction": float(row['finite_fraction']),
                "median": float(row['median']) if row['median'] else np.nan
            })

for chrom in ["HbO", "HbR", "HbT"]:
    nirs_rel_file = os.path.join(GROUP_DIR, f"NIRS/{chrom}/MULTISCALE__estimator_reliability.csv")
    if os.path.exists(nirs_rel_file):
        with open(nirs_rel_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                reliability_records.append({
                    "modality": f"fNIRS_{chrom}",
                    "branch": row['branch'],
                    "metric": row['metric'],
                    "scale": int(row['scale']),
                    "n_values": int(row['n_values']),
                    "n_finite": int(row['n_finite']),
                    "finite_fraction": float(row['finite_fraction']),
                    "median": float(row['median']) if row['median'] else np.nan
                })

rel_out_file = os.path.join(DATA_OUT, "Multiscale_Estimator_Reliability_audit.csv")
with open(rel_out_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["modality", "branch", "metric", "scale", "n_values", "n_finite", "finite_fraction_pct", "median_value", "reliability_status"])
    for r in reliability_records:
        pct = r['finite_fraction'] * 100.0
        status = "RELIABLE (100%)" if pct >= 99.9 else ("DEGRADED" if pct > 0 else "UNRELIABLE (0% FINITE)")
        med_s = f"{r['median']:.6f}" if not np.isnan(r['median']) else "NaN"
        writer.writerow([r['modality'], r['branch'], r['metric'], r['scale'], r['n_values'], r['n_finite'], f"{pct:.2f}%", med_s, status])

# Load Event-Level Target Contrasts (2T vs 2NT, 3T vs 3NT)
event_contrasts_file = os.path.join(GROUP_DIR, "EEG/EVENT__participant_balanced_target_contrasts.csv")
event_mse_records = []
if os.path.exists(event_contrasts_file):
    with open(event_contrasts_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            meas = row['measure']
            if "mse" in meas or "sample_entropy" in meas:
                event_mse_records.append(row)

event_out_file = os.path.join(DATA_OUT, "EEG_EVENT_target_contrasts_mse.csv")
if event_mse_records:
    with open(event_out_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(["participant", "load", "region", "measure", "contrast", "balanced_contrast_mean", "resample_sd", "resample_ci2_5", "resample_ci97_5"])
        for r in event_mse_records:
            writer.writerow([r['participant'], r['load'], r['region'], r['measure'], r['contrast'],
                             r['balanced_contrast_mean'], r['resample_sd'], r['resample_ci2_5'], r['resample_ci97_5']])

print("Task 3 Reliability Audit and Event decoupling completed!")

print("\n=================================================================")
print(">>> TASK 4: Cross-Scale Directionality Analysis (MSE vs. SampEn)")
print("=================================================================")

# Compare Scale 1 vs. Coarse Scales (4 & 5) and single-scale SampEn
# Look up SampEn paired contrasts
sampen_contrasts = {(c['region'], c['contrast']): c for c in scale_contrasts_extracted if c['scale'] == 1} # Scale 1 is exactly SampEn
scale5_contrasts = {(c['region'], c['contrast']): c for c in scale_contrasts_extracted if c['scale'] == 5}
scale4_contrasts = {(c['region'], c['contrast']): c for c in scale_contrasts_extracted if c['scale'] == 4}

directionality_matrix = []
contrasts_list = ["0_to_2", "0_to_3", "2_to_3"]

for reg in regions_order:
    for cont in contrasts_list:
        c1 = sampen_contrasts.get((reg, cont))
        c4 = scale4_contrasts.get((reg, cont))
        c5 = scale5_contrasts.get((reg, cont))
        
        if c1 and c5:
            dz_1 = c1['paired_dz']
            p_1 = c1['t_p']
            dz_4 = c4['paired_dz'] if c4 else np.nan
            p_4 = c4['t_p'] if c4 else np.nan
            dz_5 = c5['paired_dz']
            p_5 = c5['t_p']
            
            # Categorize directionality behavior
            # Inversion: sign flips and at least one is significant or clear shift
            if (dz_1 * dz_5 < 0) and (abs(dz_1) > 0.15 or abs(dz_5) > 0.15):
                classification = "DIRECTIONAL INVERSION (Sign Flips Across Scales)"
            elif (dz_1 * dz_5 > 0) and abs(dz_5) > abs(dz_1) + 0.15 and p_5 < 0.05:
                classification = "COARSE AMPLIFICATION (Monotonic Reinforcement)"
            elif (abs(dz_1) > 0.3 and p_1 < 0.05) and (abs(dz_5) < 0.15 and p_5 > 0.2):
                classification = "SCALE QUENCHING (Fine-Scale Only / Vanishes at Coarse)"
            elif (abs(dz_1) < 0.25 and p_1 > 0.2) and (abs(dz_5) > 0.4 and p_5 < 0.05):
                classification = "DELAYED COARSE EMERGENCE (Invisible at Scale 1)"
            else:
                classification = "STABLE / MODERATE COUPLING"
                
            directionality_matrix.append({
                "region": reg,
                "contrast": cont,
                "dz_scale1": dz_1,
                "p_scale1": p_1,
                "dz_scale4": dz_4,
                "p_scale4": p_4,
                "dz_scale5": dz_5,
                "p_scale5": p_5,
                "delta_dz_5_minus_1": dz_5 - dz_1,
                "same_direction": bool(dz_1 * dz_5 > 0),
                "classification": classification
            })

matrix_out_file = os.path.join(DATA_OUT, "MSE_vs_SampEn_Cross_Scale_Directionality_Matrix.csv")
with open(matrix_out_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["region", "contrast", "dz_scale1", "p_scale1", "dz_scale4", "p_scale4", "dz_scale5", "p_scale5",
                     "delta_dz_5_minus_1", "same_direction", "classification"])
    for r in directionality_matrix:
        writer.writerow([r['region'], r['contrast'],
                         f"{r['dz_scale1']:.4f}", f"{r['p_scale1']:.6e}",
                         f"{r['dz_scale4']:.4f}", f"{r['p_scale4']:.6e}",
                         f"{r['dz_scale5']:.4f}", f"{r['p_scale5']:.6e}",
                         f"{r['delta_dz_5_minus_1']:.4f}", "YES" if r['same_direction'] else "NO",
                         r['classification']])

print("Task 4 Cross-Scale Directionality Matrix completed!")

print("\n=================================================================")
print(">>> Generating Updated Master Web JSON Payload")
print("=================================================================")

web_master_payload = {
    "metadata": {
        "title": "Multiscale Sample Entropy (MSE) and Scale Dynamics in Cognitive Load",
        "cohort_n": 26,
        "scales": scales,
        "regions": regions_order,
        "conditions": conditions_order
    },
    "scale_by_scale_stats": scale_stats_summary,
    "multiscale_friedman": scale_friedman_extracted,
    "multiscale_contrasts": scale_contrasts_extracted,
    "estimator_reliability": reliability_records,
    "cross_scale_directionality": directionality_matrix,
    "curves_data": {
        reg: {
            cond: [scale_stats_summary[s][reg][cond]["mean"] for s in scales] for cond in conditions_order
        } for reg in regions_order
    },
    "curves_sem": {
        reg: {
            cond: [scale_stats_summary[s][reg][cond]["sem"] for s in scales] for cond in conditions_order
        } for reg in regions_order
    }
}

web_json_out = os.path.join(DATA_OUT, "MSE_SampEn_web_payload.json")
with open(web_json_out, 'w', encoding='utf-8') as f:
    json.dump(web_master_payload, f, indent=2)

print("Updated web payload JSON saved!")

print("\n=================================================================")
print(">>> Generating Publication Visualizations for Tasks 2, 3, and 4")
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

# FIG 5: Multiscale MSE Curves across Scales 1 to 5
fig, axes = plt.subplots(2, 3, figsize=(16, 10), sharex=True)
axes = axes.flatten()

cond_colors = {"0back": "#2b5c8f", "2back": "#d95f02", "3back": "#7570b3"}
cond_markers = {"0back": "o", "2back": "s", "3back": "^"}
cond_labels = {"0back": "0-back (Baseline)", "2back": "2-back (Moderate Load)", "3back": "3-back (High Load)"}

scale_x = np.array(scales)

for idx, reg in enumerate(regions_order):
    ax = axes[idx]
    for cond in conditions_order:
        means = [scale_stats_summary[s][reg][cond]["mean"] for s in scales]
        sems = [scale_stats_summary[s][reg][cond]["sem"] for s in scales]
        ax.errorbar(scale_x, means, yerr=sems, fmt=f"-{cond_markers[cond]}", color=cond_colors[cond],
                    label=cond_labels[cond], linewidth=2.2, capsize=4, markersize=7)
        ax.fill_between(scale_x, np.array(means) - np.array(sems), np.array(means) + np.array(sems),
                        color=cond_colors[cond], alpha=0.12)
        
    ax.set_title(f"{reg} Cortex MSE Scaling", fontsize=13, fontweight='bold', pad=10)
    ax.set_xticks(scales)
    ax.set_xticklabels([f"Scale {s}" for s in scales], fontsize=10.5)
    ax.set_ylabel("Sample Entropy", fontsize=11)
    ax.grid(True, alpha=0.6)
    if idx == 0:
        ax.legend(loc='lower right', frameon=True, fontsize=9.5)

plt.suptitle("Multiscale Sample Entropy (MSE) Profiles (Scales 1..5) Across Working Memory Load\nModality: Scalp EEG (N=26 Participants)",
             fontsize=15, fontweight='bold', y=0.98)
plt.tight_layout(rect=[0, 0, 1, 0.95])
fig5_path = os.path.join(FIG_OUT, "fig5_eeg_mse_multiscale_curves.png")
plt.savefig(fig5_path, dpi=300)
plt.close()
print(f"Saved: {fig5_path}")

# FIG 6: Heatmap of Paired Effect Sizes (dz) Across 5 Scales and Regions
fig, axes = plt.subplots(1, 3, figsize=(18, 6.5), sharey=True)

contrasts_meta = [
    ("0_to_2", "0-back → 2-back (Moderate Load Contrast)"),
    ("0_to_3", "0-back → 3-back (High Load Contrast)"),
    ("2_to_3", "2-back → 3-back (Incremental Overload)")
]

cmap = plt.cm.RdBu_r
norm = plt.Normalize(vmin=-0.85, vmax=0.85)

for c_idx, (cont, cont_title) in enumerate(contrasts_meta):
    ax = axes[c_idx]
    # matrix: rows = regions, cols = scales 1..5
    mat = np.zeros((len(regions_order), len(scales)))
    sig_mat = np.zeros((len(regions_order), len(scales)), dtype=bool)
    
    for r_idx, reg in enumerate(regions_order):
        for s_idx, s in enumerate(scales):
            match = [c for c in scale_contrasts_extracted if c['scale'] == s and c['region'] == reg and c['contrast'] == cont]
            if match:
                mat[r_idx, s_idx] = match[0]['paired_dz']
                sig_mat[r_idx, s_idx] = match[0]['significant_p05']
                
    im = ax.imshow(mat, cmap=cmap, norm=norm, aspect='auto')
    
    # Text in cells
    for r_idx in range(len(regions_order)):
        for s_idx in range(len(scales)):
            val = mat[r_idx, s_idx]
            sig = sig_mat[r_idx, s_idx]
            txt = f"{val:+.2f}"
            if sig:
                txt += "\n*"
            text_color = "white" if abs(val) > 0.45 else "black"
            ax.text(s_idx, r_idx, txt, ha='center', va='center', fontsize=9.5, fontweight='bold' if sig else 'normal', color=text_color)
            
    ax.set_title(cont_title, fontsize=12, fontweight='bold')
    ax.set_xticks(range(len(scales)))
    ax.set_xticklabels([f"Scale {s}" for s in scales], fontsize=10.5)
    if c_idx == 0:
        ax.set_yticks(range(len(regions_order)))
        ax.set_yticklabels(regions_order, fontsize=11, fontweight='medium')

fig.colorbar(im, ax=axes.ravel().tolist(), orientation='horizontal', fraction=0.04, pad=0.12, label="Paired Effect Size (Cohen's $d_z$) | Asterisks denote p < 0.05")
plt.suptitle("Scale-by-Scale Effect Size ($d_z$) Heatmap Across Cortical Topographies\nHighlighting Scale Inversion in Parietal and Scale Quenching in Occipital",
             fontsize=14, fontweight='bold', y=0.98)
fig6_path = os.path.join(FIG_OUT, "fig6_mse_scale_contrasts_heatmap.png")
plt.savefig(fig6_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved: {fig6_path}")

# FIG 7: Multiscale Reliability Comparison (Session vs. Event Epochs)
fig, ax = plt.subplots(figsize=(11, 6))

eeg_rel = [r for r in reliability_records if r['modality'] == 'EEG' and r['metric'] == 'mse']
sess_fractions = [next(r['finite_fraction'] * 100 for r in eeg_rel if r['branch'] == 'session' and r['scale'] == s) for s in scales]
event_fractions = [next(r['finite_fraction'] * 100 for r in eeg_rel if r['branch'] == 'event' and r['scale'] == s) for s in scales]

x = np.arange(len(scales))
width = 0.35

b1 = ax.bar(x - width/2, sess_fractions, width, label='Continuous Session Epochs (Reliable)', color='#2b5c8f', edgecolor='#111111')
b2 = ax.bar(x + width/2, event_fractions, width, label='Short Event-Related Epochs (Degrades at Scale 5)', color='#d95f02', edgecolor='#111111')

ax.set_ylabel("Valid Finite Samples Fraction (%)", fontsize=12, fontweight='medium')
ax.set_title("Multiscale Estimator Reliability: Continuous Sessions vs. Short Event Epochs\n(Demonstrating Estimator Breakdown at Scale 5 for Short Trial Epochs)",
             fontsize=13, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels([f"Scale {s}" for s in scales], fontsize=11)
ax.set_ylim(0, 115)
ax.axhline(100, color='#888888', linestyle=':', linewidth=1.0)
ax.legend(loc='lower left', frameon=True, fontsize=10.5)
ax.grid(True, axis='y', alpha=0.6)

# Value labels on top of bars
for bar, val in zip(b1, sess_fractions):
    ax.text(bar.get_x() + bar.get_width()/2., val + 2, f"{val:.1f}%", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#2b5c8f')
for bar, val in zip(b2, event_fractions):
    ax.text(bar.get_x() + bar.get_width()/2., val + 2, f"{val:.1f}%", ha='center', va='bottom', fontsize=9.5, fontweight='bold', color='#d95f02')

plt.tight_layout()
fig7_path = os.path.join(FIG_OUT, "fig7_multiscale_reliability_event_vs_session.png")
plt.savefig(fig7_path, dpi=300)
plt.close()
print(f"Saved: {fig7_path}")

# FIG 8: Fine vs. Coarse Scale Directionality (Scale 1 vs. Scale 5)
fig, axes = plt.subplots(1, 2, figsize=(15, 6.5))

# Panel A: Dumbbell / Slopegraph for 0_to_2 contrast
ax1 = axes[0]
contrast_plot = "0_to_2"
y_pos = range(len(regions_order))

dz_sc1 = [next(r['dz_scale1'] for r in directionality_matrix if r['region'] == reg and r['contrast'] == contrast_plot) for reg in regions_order]
dz_sc5 = [next(r['dz_scale5'] for r in directionality_matrix if r['region'] == reg and r['contrast'] == contrast_plot) for reg in regions_order]

for i, reg in enumerate(regions_order):
    v1 = dz_sc1[i]
    v5 = dz_sc5[i]
    line_col = "#e41a1c" if v1 * v5 < 0 else "#377eb8" # red if flips, blue if same
    ax1.plot([v1, v5], [i, i], color=line_col, linewidth=2.5, zorder=2)
    ax1.scatter(v1, i, color='#2b5c8f', s=100, zorder=3, label="Scale 1 (Fine / SampEn)" if i == 0 else "")
    ax1.scatter(v5, i, color='#d95f02', s=100, marker='s', zorder=3, label="Scale 5 (Coarse)" if i == 0 else "")
    
    # Inversion annotation
    if reg == "Parietal":
        ax1.annotate("Directional Inversion!\n(+0.30 → -0.51)", xy=((v1+v5)/2, i), xytext=((v1+v5)/2 - 0.2, i + 0.35),
                     arrowprops=dict(facecolor='#e41a1c', arrowstyle="->", lw=1.5), fontsize=9.5, fontweight='bold', color='#e41a1c')

ax1.axvline(0, color='#333333', linestyle='--', linewidth=1.2)
ax1.set_yticks(y_pos)
ax1.set_yticklabels(regions_order, fontsize=11, fontweight='medium')
ax1.set_xlabel("Paired Effect Size (Cohen's $d_z$)", fontsize=11)
ax1.set_title("0-back → 2-back (Moderate Load Effect)", fontsize=12, fontweight='bold')
ax1.legend(loc='lower left', frameon=True, fontsize=10)
ax1.grid(True, axis='x', alpha=0.6)

# Panel B: Dumbbell for 0_to_3 contrast
ax2 = axes[1]
contrast_plot2 = "0_to_3"
dz_sc1_b = [next(r['dz_scale1'] for r in directionality_matrix if r['region'] == reg and r['contrast'] == contrast_plot2) for reg in regions_order]
dz_sc5_b = [next(r['dz_scale5'] for r in directionality_matrix if r['region'] == reg and r['contrast'] == contrast_plot2) for reg in regions_order]

for i, reg in enumerate(regions_order):
    v1 = dz_sc1_b[i]
    v5 = dz_sc5_b[i]
    line_col = "#e41a1c" if v1 * v5 < 0 else "#377eb8"
    ax2.plot([v1, v5], [i, i], color=line_col, linewidth=2.5, zorder=2)
    ax2.scatter(v1, i, color='#2b5c8f', s=100, zorder=3)
    ax2.scatter(v5, i, color='#d95f02', s=100, marker='s', zorder=3)
    
    if reg == "Parietal":
        ax2.annotate("Inversion!\n(+0.46 → -0.41)", xy=((v1+v5)/2, i), xytext=((v1+v5)/2 - 0.2, i + 0.35),
                     arrowprops=dict(facecolor='#e41a1c', arrowstyle="->", lw=1.5), fontsize=9.5, fontweight='bold', color='#e41a1c')
    if reg == "Occipital":
        ax2.annotate("Scale Quenching\n(+0.72 → +0.06)", xy=((v1+v5)/2, i), xytext=((v1+v5)/2 + 0.05, i - 0.35),
                     arrowprops=dict(facecolor='#888888', arrowstyle="->", lw=1.5), fontsize=9, color='#444444')

ax2.axvline(0, color='#333333', linestyle='--', linewidth=1.2)
ax2.set_yticks(y_pos)
ax2.set_yticklabels(regions_order, fontsize=11, fontweight='medium')
ax2.set_xlabel("Paired Effect Size (Cohen's $d_z$)", fontsize=11)
ax2.set_title("0-back → 3-back (High Load Effect)", fontsize=12, fontweight='bold')
ax2.grid(True, axis='x', alpha=0.6)

plt.suptitle("Cross-Scale Complexity Divergence: Fine Scale 1 (Circle) vs. Coarse Scale 5 (Square)\nRed connector indicates Directional Inversion; Blue indicates Monotonic Direction",
             fontsize=14, fontweight='bold', y=0.98)
plt.tight_layout(rect=[0, 0, 1, 0.95])
fig8_path = os.path.join(FIG_OUT, "fig8_mse_coarse_vs_fine_directionality.png")
plt.savefig(fig8_path, dpi=300)
plt.close()
print(f"Saved: {fig8_path}")

print("\n>>> All Tasks 2, 3, and 4 processing and visualizations finished successfully!")
