#!/usr/bin/env python3
"""
Step 1: SampEn Load/Region Effect Extraction and Analysis Pipeline
Modality: EEG and fNIRS (HbO, HbR, HbT)
Task: N-Back Working Memory (0-back, 2-back, 3-back)
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

# -------------------------------------------------------------
# 1. EEG EXTRACTION
# -------------------------------------------------------------
print(">>> 1. Extracting EEG SampEn data...")

eeg_means_file = os.path.join(GROUP_DIR, "EEG/SESSION__participant_load_means.csv")
eeg_contrasts_file = os.path.join(GROUP_DIR, "EEG/SESSION__paired_load_contrasts.csv")
eeg_friedman_file = os.path.join(GROUP_DIR, "EEG/SESSION__friedman_load_tests.csv")

# A. EEG Participant Means
eeg_participants = defaultdict(lambda: defaultdict(dict)) # [part][region][cond] = val
eeg_region_cond = defaultdict(lambda: defaultdict(list)) # [region][cond] = [val1, val2, ...]

with open(eeg_means_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        part = row['participant']
        reg = row['region']
        cond = row['condition']
        val_str = row.get('entropy__sample_entropy', '')
        if val_str:
            val = float(val_str)
            eeg_participants[part][reg][cond] = val
            eeg_region_cond[reg][cond].append(val)

# Save EEG Participant Summary CSV
eeg_part_summary_file = os.path.join(DATA_OUT, "EEG_SampEn_participant_summary.csv")
regions_order = ["Central", "Frontal", "Occipital", "Parietal", "Temporal", "WholeBrain"]
conditions_order = ["0back", "2back", "3back"]

with open(eeg_part_summary_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    header = ["participant", "region", "0back", "2back", "3back", "delta_0_to_2", "delta_0_to_3", "delta_2_to_3"]
    writer.writerow(header)
    for part in sorted(eeg_participants.keys()):
        for reg in regions_order:
            if reg in eeg_participants[part]:
                c0 = eeg_participants[part][reg].get("0back", np.nan)
                c2 = eeg_participants[part][reg].get("2back", np.nan)
                c3 = eeg_participants[part][reg].get("3back", np.nan)
                d02 = c2 - c0 if not (np.isnan(c0) or np.isnan(c2)) else np.nan
                d03 = c3 - c0 if not (np.isnan(c0) or np.isnan(c3)) else np.nan
                d23 = c3 - c2 if not (np.isnan(c2) or np.isnan(c3)) else np.nan
                writer.writerow([part, reg, f"{c0:.6f}", f"{c2:.6f}", f"{c3:.6f}",
                                 f"{d02:.6f}" if not np.isnan(d02) else "",
                                 f"{d03:.6f}" if not np.isnan(d03) else "",
                                 f"{d23:.6f}" if not np.isnan(d23) else ""])

# Save EEG Regional Aggregated Stats CSV
eeg_regional_stats_file = os.path.join(DATA_OUT, "EEG_SampEn_regional_stats.csv")
eeg_stats_summary = {}

with open(eeg_regional_stats_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["region", "condition", "n_participants", "mean", "std", "sem", "median", "iqr_q25", "iqr_q75", "min", "max"])
    for reg in regions_order:
        eeg_stats_summary[reg] = {}
        for cond in conditions_order:
            vals = np.array(eeg_region_cond[reg][cond])
            n = len(vals)
            m = np.mean(vals)
            s = np.std(vals, ddof=1)
            sem = s / np.sqrt(n)
            med = np.median(vals)
            q25 = np.percentile(vals, 25)
            q75 = np.percentile(vals, 75)
            vmin = np.min(vals)
            vmax = np.max(vals)
            writer.writerow([reg, cond, n, f"{m:.6f}", f"{s:.6f}", f"{sem:.6f}", f"{med:.6f}", f"{q25:.6f}", f"{q75:.6f}", f"{vmin:.6f}", f"{vmax:.6f}"])
            eeg_stats_summary[reg][cond] = {
                "n": int(n), "mean": float(m), "std": float(s), "sem": float(sem),
                "median": float(med), "q25": float(q25), "q75": float(q75), "min": float(vmin), "max": float(vmax)
            }

# B. EEG Friedman Tests
eeg_friedman_extracted = []
with open(eeg_friedman_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['measure'] == 'entropy__sample_entropy':
            eeg_friedman_extracted.append({
                "region": row['region'],
                "n": int(row['n_complete_participants']),
                "chi2": float(row['friedman_chi2']),
                "p": float(row['friedman_p']),
                "q_global": float(row['friedman_q_global']),
                "q_primary": float(row['friedman_q_primary_family']) if row['friedman_q_primary_family'] else np.nan,
                "significant": float(row['friedman_p']) < 0.05
            })

eeg_friedman_out_file = os.path.join(DATA_OUT, "EEG_SampEn_friedman_tests.csv")
with open(eeg_friedman_out_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["region", "n_participants", "friedman_chi2", "p_value", "q_fdr_global", "q_fdr_primary", "significant_p05"])
    for r in eeg_friedman_extracted:
        writer.writerow([r['region'], r['n'], f"{r['chi2']:.4f}", f"{r['p']:.6e}", f"{r['q_global']:.6e}",
                         f"{r['q_primary']:.6e}" if not np.isnan(r['q_primary']) else "", "YES" if r['significant'] else "NO"])

# C. EEG Paired Contrasts
eeg_contrasts_extracted = []
with open(eeg_contrasts_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['measure'] == 'entropy__sample_entropy':
            eeg_contrasts_extracted.append({
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
                "wilcoxon_W": float(row['wilcoxon_W']),
                "wilcoxon_p": float(row['wilcoxon_p']),
                "t_p_q_global": float(row['t_p_q_global']) if row['t_p_q_global'] else np.nan,
                "significant_p05": float(row['t_p']) < 0.05
            })

eeg_contrasts_out_file = os.path.join(DATA_OUT, "EEG_SampEn_paired_contrasts.csv")
with open(eeg_contrasts_out_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["region", "contrast", "cond_A", "cond_B", "mean_contrast", "sd_contrast", "ci95_low", "ci95_high",
                     "paired_dz", "rank_biserial", "t_stat", "t_p_value", "wilcoxon_p", "fdr_q_global", "significant_p05"])
    for c in eeg_contrasts_extracted:
        writer.writerow([c['region'], c['contrast'], c['condition_A'], c['condition_B'],
                         f"{c['mean_contrast']:.6f}", f"{c['sd_contrast']:.6f}", f"{c['ci95_low']:.6f}", f"{c['ci95_high']:.6f}",
                         f"{c['paired_dz']:.4f}", f"{c['rank_biserial']:.4f}", f"{c['t']:.4f}", f"{c['t_p']:.6e}",
                         f"{c['wilcoxon_p']:.6e}", f"{c['t_p_q_global']:.6e}" if not np.isnan(c['t_p_q_global']) else "",
                         "YES" if c['significant_p05'] else "NO"])

print("EEG processing done!")

# -------------------------------------------------------------
# 2. NIRS EXTRACTION (HbO, HbR, HbT)
# -------------------------------------------------------------
print(">>> 2. Extracting NIRS SampEn data...")

chromophores = ["HbO", "HbR", "HbT"]
nirs_data = {}
nirs_friedman_all = []
nirs_contrasts_all = []
nirs_regional_stats_all = []

for chrom in chromophores:
    nirs_dir = os.path.join(GROUP_DIR, f"NIRS/{chrom}")
    means_f = os.path.join(nirs_dir, "SESSION__participant_load_means.csv")
    contrasts_f = os.path.join(nirs_dir, "SESSION__paired_load_contrasts.csv")
    friedman_f = os.path.join(nirs_dir, "SESSION__friedman_load_tests.csv")
    
    nirs_data[chrom] = {
        "participants": defaultdict(lambda: defaultdict(dict)),
        "region_cond": defaultdict(lambda: defaultdict(list)),
        "friedman": [],
        "contrasts": [],
        "stats": {}
    }
    
    # Means
    with open(means_f, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            p = row['participant']
            r = row['region']
            c = row['condition']
            val_s = row.get('entropy__sample_entropy', '')
            if val_s:
                v = float(val_s)
                nirs_data[chrom]["participants"][p][r][c] = v
                nirs_data[chrom]["region_cond"][r][c].append(v)
                
    # Stats
    for r in regions_order:
        if r in nirs_data[chrom]["region_cond"]:
            nirs_data[chrom]["stats"][r] = {}
            for cond in conditions_order:
                vals = np.array(nirs_data[chrom]["region_cond"][r][cond])
                if len(vals) > 0:
                    n = len(vals)
                    m = np.mean(vals)
                    s = np.std(vals, ddof=1) if n > 1 else 0.0
                    sem = s / np.sqrt(n) if n > 0 else 0.0
                    med = np.median(vals)
                    q25 = np.percentile(vals, 25)
                    q75 = np.percentile(vals, 75)
                    nirs_regional_stats_all.append({
                        "chromophore": chrom, "region": r, "condition": cond,
                        "n": n, "mean": m, "std": s, "sem": sem, "median": med,
                        "q25": q25, "q75": q75
                    })
                    nirs_data[chrom]["stats"][r][cond] = {
                        "n": int(n), "mean": float(m), "std": float(s), "sem": float(sem),
                        "median": float(med), "q25": float(q25), "q75": float(q75)
                    }
                    
    # Friedman
    with open(friedman_f, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['measure'] == 'entropy__sample_entropy':
                entry = {
                    "chromophore": chrom,
                    "region": row['region'],
                    "n": int(row['n_complete_participants']),
                    "chi2": float(row['friedman_chi2']),
                    "p": float(row['friedman_p']),
                    "q_global": float(row['friedman_q_global']),
                    "significant": float(row['friedman_p']) < 0.05
                }
                nirs_data[chrom]["friedman"].append(entry)
                nirs_friedman_all.append(entry)
                
    # Contrasts
    with open(contrasts_f, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['measure'] == 'entropy__sample_entropy':
                entry = {
                    "chromophore": chrom,
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
                    "t_p_q_global": float(row['t_p_q_global']) if row['t_p_q_global'] else np.nan,
                    "significant_p05": float(row['t_p']) < 0.05
                }
                nirs_data[chrom]["contrasts"].append(entry)
                nirs_contrasts_all.append(entry)

# Save NIRS CSVs
nirs_stats_file = os.path.join(DATA_OUT, "NIRS_SampEn_regional_stats.csv")
with open(nirs_stats_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "condition", "n", "mean", "std", "sem", "median", "q25", "q75"])
    for s in nirs_regional_stats_all:
        writer.writerow([s['chromophore'], s['region'], s['condition'], s['n'],
                         f"{s['mean']:.6f}", f"{s['std']:.6f}", f"{s['sem']:.6f}", f"{s['median']:.6f}",
                         f"{s['q25']:.6f}", f"{s['q75']:.6f}"])

nirs_friedman_file = os.path.join(DATA_OUT, "NIRS_SampEn_friedman_tests.csv")
with open(nirs_friedman_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "n_participants", "friedman_chi2", "p_value", "q_fdr_global", "significant_p05"])
    for r in nirs_friedman_all:
        writer.writerow([r['chromophore'], r['region'], r['n'], f"{r['chi2']:.4f}", f"{r['p']:.6e}", f"{r['q_global']:.6e}", "YES" if r['significant'] else "NO"])

nirs_contrasts_file = os.path.join(DATA_OUT, "NIRS_SampEn_paired_contrasts.csv")
with open(nirs_contrasts_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(["chromophore", "region", "contrast", "cond_A", "cond_B", "mean_contrast", "sd_contrast", "ci95_low", "ci95_high",
                     "paired_dz", "rank_biserial", "t_stat", "t_p_value", "wilcoxon_p", "fdr_q_global", "significant_p05"])
    for c in nirs_contrasts_all:
        writer.writerow([c['chromophore'], c['region'], c['contrast'], c['condition_A'], c['condition_B'],
                         f"{c['mean_contrast']:.6f}", f"{c['sd_contrast']:.6f}", f"{c['ci95_low']:.6f}", f"{c['ci95_high']:.6f}",
                         f"{c['paired_dz']:.4f}", f"{c['rank_biserial']:.4f}", f"{c['t']:.4f}", f"{c['t_p']:.6e}",
                         f"{c['wilcoxon_p']:.6e}", f"{c['t_p_q_global']:.6e}" if not np.isnan(c['t_p_q_global']) else "",
                         "YES" if c['significant_p05'] else "NO"])

print("NIRS processing done!")

# -------------------------------------------------------------
# 3. WEB-READY JSON PAYLOAD GENERATION
# -------------------------------------------------------------
print(">>> 3. Generating Web JSON Payload...")

web_payload = {
    "metadata": {
        "title": "Multimodal Cognitive Load Analysis: Sample Entropy (SampEn) Dynamics",
        "description": "Comprehensive electrophysiological (EEG) and hemodynamic (fNIRS) analysis of cortical complexity during N-back working memory tasks.",
        "sample_size": 26,
        "conditions": ["0-back (Control/Baseline)", "2-back (Moderate Load)", "3-back (High Load)"],
        "regions": regions_order,
        "chromophores": chromophores
    },
    "eeg": {
        "regional_stats": eeg_stats_summary,
        "friedman_tests": eeg_friedman_extracted,
        "paired_contrasts": eeg_contrasts_extracted
    },
    "nirs": {
        "chromophores": {
            chrom: {
                "regional_stats": nirs_data[chrom]["stats"],
                "friedman_tests": nirs_data[chrom]["friedman"],
                "paired_contrasts": nirs_data[chrom]["contrasts"]
            } for chrom in chromophores
        }
    },
    "charts_data": {
        "eeg_load_curves": {
            reg: [eeg_stats_summary[reg][c]["mean"] for c in conditions_order] for reg in regions_order
        },
        "eeg_load_sem": {
            reg: [eeg_stats_summary[reg][c]["sem"] for c in conditions_order] for reg in regions_order
        },
        "eeg_contrasts_dz": {
            reg: {c['contrast']: c['paired_dz'] for c in eeg_contrasts_extracted if c['region'] == reg} for reg in regions_order
        },
        "nirs_hbo_load_curves": {
            reg: [nirs_data["HbO"]["stats"][reg][c]["mean"] for c in conditions_order] for reg in regions_order if reg in nirs_data["HbO"]["stats"]
        }
    }
}

json_file = os.path.join(DATA_OUT, "SampEn_web_payload.json")
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(web_payload, f, indent=2)

print("Web JSON payload generated!")

# -------------------------------------------------------------
# 4. PUBLICATION-QUALITY VISUALIZATIONS
# -------------------------------------------------------------
print(">>> 4. Creating Publication-Grade Visualizations...")

plt.rcParams.update({
    'font.sans-serif': 'DejaVu Sans',
    'font.family': 'sans-serif',
    'axes.edgecolor': '#333333',
    'axes.linewidth': 1.1,
    'grid.color': '#DDDDDD',
    'grid.linestyle': '--',
    'grid.linewidth': 0.7,
    'figure.autolayout': False
})

# FIG 1: EEG SampEn Load Response Profiles across 6 cortical regions
fig, axes = plt.subplots(2, 3, figsize=(16, 10), sharey=False)
axes = axes.flatten()

color_palette = {
    "Central": "#2b5c8f",
    "Frontal": "#d95f02",
    "Occipital": "#7570b3",
    "Parietal": "#1b9e77",
    "Temporal": "#e7298a",
    "WholeBrain": "#333333"
}

x_ticks = [0, 1, 2]
x_labels = ["0-back", "2-back", "3-back"]

for idx, reg in enumerate(regions_order):
    ax = axes[idx]
    reg_color = color_palette[reg]
    
    # Individual participant lines in subtle alpha
    for part in sorted(eeg_participants.keys()):
        y_pts = [eeg_participants[part][reg].get(c, np.nan) for c in conditions_order]
        ax.plot(x_ticks, y_pts, color='#888888', alpha=0.18, linewidth=0.9)
    
    # Group Mean +/- SEM
    means = [eeg_stats_summary[reg][c]["mean"] for c in conditions_order]
    sems = [eeg_stats_summary[reg][c]["sem"] for c in conditions_order]
    
    ax.errorbar(x_ticks, means, yerr=sems, fmt='-o', color=reg_color, ecolor=reg_color,
                elinewidth=2.5, capsize=5, capthick=1.8, markersize=8, linewidth=2.8,
                label=f"Group Mean ± SEM")
    
    # Region significance annotation
    fried_res = [r for r in eeg_friedman_extracted if r['region'] == reg][0]
    sig_label = f"$\chi^2$={fried_res['chi2']:.2f}, p={fried_res['p']:.3f}"
    if fried_res['significant']:
        sig_label += " *"
        ax.set_facecolor("#faf8f5")
    else:
        ax.set_facecolor("#ffffff")
        
    ax.set_title(f"{reg} Cortex\n({sig_label})", fontsize=13, fontweight='bold', pad=10)
    ax.set_xticks(x_ticks)
    ax.set_xticklabels(x_labels, fontsize=11, fontweight='medium')
    ax.set_ylabel("Sample Entropy (SampEn)", fontsize=11)
    ax.grid(True, alpha=0.6)
    
    # Text annotation for significant contrasts
    contrasts_reg = [c for c in eeg_contrasts_extracted if c['region'] == reg]
    text_sig = []
    for c in contrasts_reg:
        if c['significant_p05']:
            text_sig.append(f"{c['contrast']}: dz={c['paired_dz']:+.2f} (p={c['t_p']:.3f})")
    if text_sig:
        ax.text(0.04, 0.06, "\n".join(text_sig), transform=ax.transAxes, fontsize=9.5,
                bbox=dict(boxstyle='round,pad=0.3', facecolor='#ffffff', edgecolor='#cccccc', alpha=0.9))

plt.suptitle("EEG Sample Entropy (SampEn) Trajectories Across Cognitive Load Levels\nTask: Memory N-Back (N=26 Participants)",
             fontsize=16, fontweight='bold', y=0.98)
plt.tight_layout(rect=[0, 0, 1, 0.95])
fig1_path = os.path.join(FIG_OUT, "fig1_eeg_sampen_load_profiles.png")
plt.savefig(fig1_path, dpi=300)
plt.close()
print(f"Saved: {fig1_path}")

# FIG 2: Effect Size Forest Plot (Cohen's dz) with 95% Confidence Intervals
fig, ax = plt.subplots(figsize=(12, 8))

y_positions = []
y_labels = []
contrast_colors = {
    "0_to_2": "#2b5c8f",
    "0_to_3": "#e66101",
    "2_to_3": "#2ca25f"
}
contrast_names = {
    "0_to_2": "0-back → 2-back (Moderate Load Effect)",
    "0_to_3": "0-back → 3-back (High Load Effect)",
    "2_to_3": "2-back → 3-back (Incremental Overload)"
}

current_y = 0
for reg in reversed(regions_order):
    reg_contrasts = [c for c in eeg_contrasts_extracted if c['region'] == reg]
    for c in sorted(reg_contrasts, key=lambda x: x['contrast'], reverse=True):
        dz = c['paired_dz']
        # CI approx for dz or using CI from mean contrast normalized
        m = c['mean_contrast']
        sd = c['sd_contrast']
        ci_l = c['ci95_low'] / (sd / np.sqrt(c['n'])) * (1.0 / np.sqrt(c['n'])) if sd > 0 else dz - 0.2
        ci_h = c['ci95_high'] / (sd / np.sqrt(c['n'])) * (1.0 / np.sqrt(c['n'])) if sd > 0 else dz + 0.2
        # Use exact dz limits based on t CI approx:
        dz_se = np.sqrt((1.0 / c['n']) + (dz**2 / (2 * c['n'])))
        ci_l_dz = dz - 1.96 * dz_se
        ci_h_dz = dz + 1.96 * dz_se
        
        color = contrast_colors[c['contrast']]
        ax.plot([ci_l_dz, ci_h_dz], [current_y, current_y], color=color, linewidth=2.2)
        marker = 's' if c['significant_p05'] else 'o'
        ax.plot(dz, current_y, marker=marker, color=color, markersize=8 if c['significant_p05'] else 6)
        
        # Sig text
        if c['significant_p05']:
            ax.text(ci_h_dz + 0.04, current_y, f"p={c['t_p']:.3f} *", va='center', fontsize=9.5, fontweight='bold', color=color)
            
        y_positions.append(current_y)
        y_labels.append(f"{reg} | {c['contrast']}")
        current_y += 1
    current_y += 0.5 # gap between regions

ax.axvline(0, color='#222222', linestyle='--', linewidth=1.2, alpha=0.8)
ax.axvline(0.5, color='#aaaaaa', linestyle=':', linewidth=0.9, alpha=0.7)
ax.axvline(-0.5, color='#aaaaaa', linestyle=':', linewidth=0.9, alpha=0.7)

ax.set_yticks(y_positions)
ax.set_yticklabels(y_labels, fontsize=10.5)
ax.set_xlabel("Paired Effect Size (Cohen's $d_z$) with 95% Confidence Intervals", fontsize=12, fontweight='medium')
ax.set_title("Standardized Effect Sizes ($d_z$) of Cognitive Load on EEG Sample Entropy\n(Squares = Statistically Significant p < 0.05)",
             fontsize=14, fontweight='bold', pad=15)
ax.grid(True, axis='x', alpha=0.6)

# Legend
custom_lines = [
    plt.Line2D([0], [0], color=contrast_colors["0_to_2"], lw=3, label=contrast_names["0_to_2"]),
    plt.Line2D([0], [0], color=contrast_colors["0_to_3"], lw=3, label=contrast_names["0_to_3"]),
    plt.Line2D([0], [0], color=contrast_colors["2_to_3"], lw=3, label=contrast_names["2_to_3"])
]
ax.legend(handles=custom_lines, loc='lower right', frameon=True, fontsize=10.5)

plt.tight_layout()
fig2_path = os.path.join(FIG_OUT, "fig2_eeg_sampen_effect_sizes.png")
plt.savefig(fig2_path, dpi=300)
plt.close()
print(f"Saved: {fig2_path}")

# FIG 3: NIRS Chromophore Comparison (HbO, HbR, HbT) across Load Levels
fig, axes = plt.subplots(1, 3, figsize=(18, 5.5), sharey=True)
chrom_colors = {"HbO": "#b2182b", "HbR": "#2166ac", "HbT": "#762a83"}

nirs_regions_plot = ["Frontal", "Central", "Parietal", "Occipital", "WholeBrain"]
styles = {"Frontal": "-o", "Central": "--s", "Parietal": "-.^", "Occipital": ":d", "WholeBrain": "-x"}

for idx, chrom in enumerate(chromophores):
    ax = axes[idx]
    c_color = chrom_colors[chrom]
    for reg in nirs_regions_plot:
        if reg in nirs_data[chrom]["stats"]:
            means = [nirs_data[chrom]["stats"][reg][c]["mean"] for c in conditions_order]
            sems = [nirs_data[chrom]["stats"][reg][c]["sem"] for c in conditions_order]
            ax.errorbar(x_ticks, means, yerr=sems, fmt=styles[reg], label=reg, linewidth=2.0, capsize=4, markersize=7)
            
    ax.set_title(f"fNIRS Chromophore: {chrom}", fontsize=13, fontweight='bold')
    ax.set_xticks(x_ticks)
    ax.set_xticklabels(x_labels, fontsize=11)
    if idx == 0:
        ax.set_ylabel("Hemodynamic SampEn", fontsize=12)
    ax.grid(True, alpha=0.6)
    ax.legend(loc='upper right', frameon=True, fontsize=9.5)

plt.suptitle("fNIRS Hemodynamic Complexity (Sample Entropy) Dynamics across Cognitive Load\n(Comparison of Oxy-Hb, Deoxy-Hb, and Total-Hb)",
             fontsize=15, fontweight='bold', y=0.99)
plt.tight_layout(rect=[0, 0, 1, 0.95])
fig3_path = os.path.join(FIG_OUT, "fig3_nirs_sampen_chromophores.png")
plt.savefig(fig3_path, dpi=300)
plt.close()
print(f"Saved: {fig3_path}")

# FIG 4: Multimodal Comparative Significance Landscape (EEG vs. fNIRS)
fig, ax = plt.subplots(figsize=(13, 6))

plot_regions = ["Frontal", "Occipital", "Parietal", "Central", "Temporal", "WholeBrain"]
x = np.arange(len(plot_regions))
width = 0.2

# Extract Chi2
chi2_eeg = [next((r['chi2'] for r in eeg_friedman_extracted if r['region'] == reg), 0) for reg in plot_regions]
chi2_hbo = [next((r['chi2'] for r in nirs_data["HbO"]["friedman"] if r['region'] == reg), 0) for reg in plot_regions]
chi2_hbr = [next((r['chi2'] for r in nirs_data["HbR"]["friedman"] if r['region'] == reg), 0) for reg in plot_regions]
chi2_hbt = [next((r['chi2'] for r in nirs_data["HbT"]["friedman"] if r['region'] == reg), 0) for reg in plot_regions]

b1 = ax.bar(x - 1.5*width, chi2_eeg, width, label='EEG (Neural Electrophysiology)', color='#2b5c8f', edgecolor='#111111')
b2 = ax.bar(x - 0.5*width, chi2_hbo, width, label='fNIRS HbO (Oxy-Hemoglobin)', color='#d6604d', edgecolor='#111111')
b3 = ax.bar(x + 0.5*width, chi2_hbr, width, label='fNIRS HbR (Deoxy-Hemoglobin)', color='#4393c3', edgecolor='#111111')
b4 = ax.bar(x + 1.5*width, chi2_hbt, width, label='fNIRS HbT (Total-Hemoglobin)', color='#9970ab', edgecolor='#111111')

# Critical Chi2 threshold for df=2, alpha=0.05 is 5.991
ax.axhline(5.991, color='#b2182b', linestyle='--', linewidth=1.5, label='Significance Threshold ($\chi^2 \geq 5.99, p < 0.05$)')

ax.set_ylabel("Friedman Non-Parametric Statistic ($\chi^2$)", fontsize=12, fontweight='medium')
ax.set_title("Cross-Modal Complexity Sensitivity: EEG vs. fNIRS Load Effect ($\chi^2$ Statistics)\nBars exceeding red dashed line indicate significant cognitive load modulation",
             fontsize=13, fontweight='bold', pad=15)
ax.set_xticks(x)
ax.set_xticklabels(plot_regions, fontsize=11, fontweight='medium')
ax.legend(loc='upper right', frameon=True, fontsize=10.5)
ax.grid(True, axis='y', alpha=0.6)

# Annotate significance stars
for bars, chi_list in zip([b1, b2, b3, b4], [chi2_eeg, chi2_hbo, chi2_hbr, chi2_hbt]):
    for bar, val in zip(bars, chi_list):
        if val >= 5.991:
            ax.text(bar.get_x() + bar.get_width()/2., val + 0.25, "*", ha='center', va='bottom', fontsize=12, fontweight='bold', color='#b2182b')

plt.tight_layout()
fig4_path = os.path.join(FIG_OUT, "fig4_eeg_vs_nirs_significance_map.png")
plt.savefig(fig4_path, dpi=300)
plt.close()
print(f"Saved: {fig4_path}")

print(">>> Step 1 Pipeline execution completed successfully!")
