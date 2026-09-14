#!/usr/bin/env python3
"""
Task 5: Amplitude-Control Analysis Pipeline
Evaluates whether Sample Entropy and MSE load effects reflect intrinsic non-linear
neural complexity or are secondary to linear amplitude/power shifts.
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
contrasts_order = ["0_to_2", "0_to_3", "2_to_3"]
key_amp_measures = ["amp__rms", "amp__broadband_power_1_45", "amp__theta_relative_4_8", "amp__alpha_relative_8_13", "amp__beta_relative_13_30"]
amp_labels = {
    "amp__rms": "RMS (Total Amplitude)",
    "amp__broadband_power_1_45": "Broadband Power (1-45 Hz)",
    "amp__theta_relative_4_8": "Relative Theta (4-8 Hz)",
    "amp__alpha_relative_8_13": "Relative Alpha (8-13 Hz)",
    "amp__beta_relative_13_30": "Relative Beta (13-30 Hz)"
}

print("=================================================================")
print(">>> TASK 5: Extracting Amplitude-Controlled Contrasts")
print("=================================================================")

# 1. Load unadjusted contrasts for reference
raw_contrasts = {}
unadj_file = os.path.join(DATA_OUT, "EEG_SampEn_paired_contrasts.csv")
if os.path.exists(unadj_file):
    with open(unadj_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            raw_contrasts[(row['region'], row['contrast'])] = {
                "mean_contrast": float(row['mean_contrast']),
                "paired_dz": float(row['paired_dz']),
                "t_stat": float(row['t_stat']),
                "t_p_value": float(row['t_p_value'])
            }

# 2. Extract Session Amplitude Controlled Contrasts
session_amp_file = os.path.join(GROUP_DIR, "EEG/SESSION__entropy_load_contrasts_after_amplitude_control.csv")
amp_contrasts_extracted = []

with open(session_amp_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meas = row['entropy_measure']
        if meas in ['entropy__sample_entropy', 'entropy__mse']:
            reg = row['region']
            cont = row['contrast']
            amp_meas = row['amplitude_measure']
            raw_ref = raw_contrasts.get((reg, cont), {})
            
            entry = {
                "branch": row['branch'],
                "region": reg,
                "entropy_measure": meas,
                "amplitude_measure": amp_meas,
                "contrast": cont,
                "n": int(row['n']),
                "raw_mean_contrast": raw_ref.get("mean_contrast", np.nan),
                "raw_paired_dz": raw_ref.get("paired_dz", np.nan),
                "raw_p_value": raw_ref.get("t_p_value", np.nan),
                "beta0_adjusted_entropy": float(row['beta0_adjusted_entropy']),
                "beta1_amplitude": float(row['beta1_amplitude']),
                "beta0_se": float(row['beta0_se']),
                "beta0_t": float(row['beta0_t']),
                "beta0_p": float(row['beta0_p']),
                "r2": float(row['r2']),
                "beta0_q_global": float(row['beta0_q_global']) if row['beta0_q_global'] else np.nan,
                "beta0_q_within": float(row['beta0_q_within_entropy_region']) if row['beta0_q_within_entropy_region'] else np.nan,
                "retains_significance": float(row['beta0_p']) < 0.05
            }
            amp_contrasts_extracted.append(entry)

out_amp_contrasts = os.path.join(DATA_OUT, "EEG_amplitude_controlled_load_contrasts.csv")
with open(out_amp_contrasts, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow([
        "region", "entropy_measure", "amplitude_measure", "contrast",
        "raw_mean_contrast", "raw_p_value",
        "beta0_adjusted_entropy", "beta1_amplitude_coupling", "beta0_t_stat",
        "beta0_p_value", "r2_explained_by_amplitude", "retains_significance_p05"
    ])
    for r in amp_contrasts_extracted:
        writer.writerow([
            r['region'], r['entropy_measure'], r['amplitude_measure'], r['contrast'],
            f"{r['raw_mean_contrast']:.6f}" if not np.isnan(r['raw_mean_contrast']) else "",
            f"{r['raw_p_value']:.6e}" if not np.isnan(r['raw_p_value']) else "",
            f"{r['beta0_adjusted_entropy']:.6f}", f"{r['beta1_amplitude']:.6f}",
            f"{r['beta0_t']:.4f}", f"{r['beta0_p']:.6e}", f"{r['r2']:.4f}",
            "YES" if r['retains_significance'] else "NO"
        ])

# 3. Extract Amplitude-Entropy Correlations
corr_summary_file = os.path.join(GROUP_DIR, "EEG/GROUP__amplitude_entropy_correlation_summary.csv")
correlations_extracted = []

with open(corr_summary_file, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        meas = row['entropy_measure']
        if meas in ['entropy__sample_entropy', 'entropy__mse'] and row['branch'] == 'session':
            correlations_extracted.append({
                "branch": row['branch'],
                "region": row['region'],
                "entropy_measure": meas,
                "amplitude_measure": row['amplitude_measure'],
                "n_participants": int(row['n_participants']),
                "fisher_mean_pearson_r": float(row['fisher_mean_pearson_r']),
                "ci95_low_r": float(row['ci95_low_r']),
                "ci95_high_r": float(row['ci95_high_r']),
                "fisher_z_t": float(row['fisher_z_t']),
                "group_p": float(row['group_p']),
                "mean_spearman_rho": float(row['mean_spearman_rho']),
                "q_global": float(row['q_global']),
                "significant": float(row['group_p']) < 0.05
            })

out_corr_file = os.path.join(DATA_OUT, "EEG_amplitude_entropy_correlation_summary.csv")
with open(out_corr_file, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow([
        "region", "entropy_measure", "amplitude_measure", "fisher_mean_pearson_r",
        "ci95_low_r", "ci95_high_r", "mean_spearman_rho", "fisher_z_t", "group_p", "q_global", "significant_p05"
    ])
    for r in correlations_extracted:
        writer.writerow([
            r['region'], r['entropy_measure'], r['amplitude_measure'],
            f"{r['fisher_mean_pearson_r']:.4f}", f"{r['ci95_low_r']:.4f}", f"{r['ci95_high_r']:.4f}",
            f"{r['mean_spearman_rho']:.4f}", f"{r['fisher_z_t']:.4f}", f"{r['group_p']:.6e}",
            f"{r['q_global']:.6e}", "YES" if r['significant'] else "NO"
        ])

# 4. Extract Event-level Amplitude Controlled Contrasts (if available)
event_amp_file = os.path.join(GROUP_DIR, "EEG/EVENT__entropy_contrasts_after_amplitude_control.csv")
event_amp_extracted = []
if os.path.exists(event_amp_file):
    with open(event_amp_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['entropy_measure'] in ['entropy__sample_entropy', 'entropy__mse']:
                event_amp_extracted.append(row)

if event_amp_extracted:
    out_event_amp = os.path.join(DATA_OUT, "EEG_EVENT_amplitude_controlled_contrasts.csv")
    with open(out_event_amp, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(list(event_amp_extracted[0].keys()))
        for r in event_amp_extracted:
            writer.writerow(list(r.values()))

print("Data tables for Amplitude Control extracted successfully!")

# -------------------------------------------------------------
# 5. UPDATE WEB PAYLOAD JSON
# -------------------------------------------------------------
master_json_file = os.path.join(DATA_OUT, "MSE_SampEn_web_payload.json")
if os.path.exists(master_json_file):
    with open(master_json_file, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
else:
    master_data = {}

master_data["amplitude_control"] = {
    "key_amplitude_features": key_amp_measures,
    "adjusted_contrasts_summary": [
        {
            "region": r['region'],
            "entropy": r['entropy_measure'],
            "amplitude": r['amplitude_measure'],
            "contrast": r['contrast'],
            "raw_contrast": r['raw_mean_contrast'],
            "beta0_adjusted": r['beta0_adjusted_entropy'],
            "beta0_p": r['beta0_p'],
            "r2": r['r2'],
            "retains_significance": r['retains_significance']
        } for r in amp_contrasts_extracted if r['entropy_measure'] == 'entropy__sample_entropy' and r['amplitude_measure'] in key_amp_measures
    ],
    "correlations_summary": [
        {
            "region": r['region'],
            "amplitude": r['amplitude_measure'],
            "pearson_r": r['fisher_mean_pearson_r'],
            "spearman_rho": r['mean_spearman_rho'],
            "p_val": r['group_p']
        } for r in correlations_extracted if r['entropy_measure'] == 'entropy__sample_entropy' and r['amplitude_measure'] in key_amp_measures
    ]
}

with open(master_json_file, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, indent=2)

print("Updated Master Web JSON with Amplitude Control data!")

# -------------------------------------------------------------
# 6. PUBLICATION-GRADE VISUALIZATIONS (300 DPI)
# -------------------------------------------------------------
print("=================================================================")
print(">>> Generating Visualizations for Task 5")
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

# FIG 9: Heatmap of Amplitude-Entropy Correlations
fig, ax = plt.subplots(figsize=(12, 7))

# Get all unique amplitude measures present
all_amps = sorted(list(set(r['amplitude_measure'] for r in correlations_extracted if r['entropy_measure'] == 'entropy__sample_entropy')))
# Clean display names for amplitudes
clean_amp_names = [a.replace("amp__", "").replace("_", " ").title() for a in all_amps]

corr_matrix = np.zeros((len(all_amps), len(regions_order)))
sig_matrix = np.zeros((len(all_amps), len(regions_order)), dtype=bool)

for a_idx, amp in enumerate(all_amps):
    for r_idx, reg in enumerate(regions_order):
        match = [c for c in correlations_extracted if c['entropy_measure'] == 'entropy__sample_entropy' and c['amplitude_measure'] == amp and c['region'] == reg]
        if match:
            corr_matrix[a_idx, r_idx] = match[0]['fisher_mean_pearson_r']
            sig_matrix[a_idx, r_idx] = match[0]['significant']

im = ax.imshow(corr_matrix, cmap='RdBu_r', vmin=-0.85, vmax=0.85, aspect='auto')

for a_idx in range(len(all_amps)):
    for r_idx in range(len(regions_order)):
        val = corr_matrix[a_idx, r_idx]
        sig = sig_matrix[a_idx, r_idx]
        txt = f"{val:+.2f}"
        if sig:
            txt += "*"
        color = "white" if abs(val) > 0.45 else "black"
        ax.text(r_idx, a_idx, txt, ha='center', va='center', fontsize=9, fontweight='bold' if sig else 'normal', color=color)

ax.set_xticks(range(len(regions_order)))
ax.set_xticklabels(regions_order, fontsize=11, fontweight='medium')
ax.set_yticks(range(len(all_amps)))
ax.set_yticklabels(clean_amp_names, fontsize=10)

cbar = fig.colorbar(im, ax=ax, fraction=0.03, pad=0.03)
cbar.set_label("Fisher-Mean Pearson Correlation ($r$)", fontsize=11)

ax.set_title("Electrophysiological Coupling: Correlations Between Amplitude/Power and Sample Entropy\n(* indicates statistically significant group correlation p < 0.05)",
             fontsize=13, fontweight='bold', pad=15)
plt.tight_layout()
fig9_path = os.path.join(FIG_OUT, "fig9_amplitude_entropy_correlations.png")
plt.savefig(fig9_path, dpi=300)
plt.close()
print(f"Saved: {fig9_path}")

# FIG 10: Comparison of Unadjusted vs. Amplitude-Controlled Effect Sizes (Beta0)
fig, axes = plt.subplots(1, 3, figsize=(18, 6.5), sharey=True)

# Key regions to display
target_regions = ["Frontal", "Occipital", "Parietal"]

for idx, reg in enumerate(target_regions):
    ax = axes[idx]
    
    # We examine 0_to_2 contrast
    cont = "0_to_2"
    
    # Get raw contrast
    raw_val = raw_contrasts.get((reg, cont), {}).get("mean_contrast", 0.0)
    raw_p = raw_contrasts.get((reg, cont), {}).get("t_p_value", 1.0)
    
    y_labels = ["Unadjusted (Raw)"]
    y_vals = [raw_val]
    y_sig = [raw_p < 0.05]
    y_colors = ["#333333"]
    
    # Control measures
    ctrl_data = [r for r in amp_contrasts_extracted if r['region'] == reg and r['contrast'] == cont and r['entropy_measure'] == 'entropy__sample_entropy' and r['amplitude_measure'] in key_amp_measures]
    for cd in ctrl_data:
        y_labels.append(f"Adj: {amp_labels[cd['amplitude_measure']]}")
        y_vals.append(cd['beta0_adjusted_entropy'])
        y_sig.append(cd['retains_significance'])
        y_colors.append("#2b5c8f" if cd['retains_significance'] else "#d95f02")
        
    y_pos = np.arange(len(y_labels))
    
    bars = ax.barh(y_pos, y_vals, color=y_colors, alpha=0.85, edgecolor='#111111', height=0.6)
    ax.axvline(0, color='#222222', linestyle='--', linewidth=1.2)
    
    # Annotate values and significance
    for b_idx, (b, val, sig) in enumerate(zip(bars, y_vals, y_sig)):
        x_text = val + (0.003 if val >= 0 else -0.003)
        ha = 'left' if val >= 0 else 'right'
        ann = f"{val:+.4f}"
        if sig:
            ann += " *"
        ax.text(x_text, b.get_y() + b.get_height()/2., ann, va='center', ha=ha, fontsize=9.5, fontweight='bold' if sig else 'normal')
        
    ax.set_yticks(y_pos)
    if idx == 0:
        ax.set_yticklabels(y_labels, fontsize=10.5)
    ax.set_title(f"{reg} Cortex: 0-back → 2-back Contrast", fontsize=12, fontweight='bold')
    ax.set_xlabel("Mean Entropy Contrast ($\Delta$ SampEn / Adjusted $\\beta_0$)", fontsize=10.5)
    ax.grid(True, axis='x', alpha=0.6)

# Legend
custom_handles = [
    plt.Rectangle((0,0),1,1, color='#333333', label='Unadjusted Contrast'),
    plt.Rectangle((0,0),1,1, color='#2b5c8f', label='Retains Significance (p < 0.05)'),
    plt.Rectangle((0,0),1,1, color='#d95f02', label='Attenuated / Non-Significant')
]
fig.legend(handles=custom_handles, loc='upper center', bbox_to_anchor=(0.5, 0.98), ncol=3, frameon=True, fontsize=11)

plt.suptitle("Amplitude Control Robustness: Pure Nonlinear Complexity Changes vs. Amplitude-Adjusted $\\beta_0$\nExamining Occipital, Frontal, and Parietal Cortices Under Cognitive Load",
             fontsize=14, fontweight='bold', y=1.04)
plt.tight_layout()
fig10_path = os.path.join(FIG_OUT, "fig10_amplitude_controlled_contrasts.png")
plt.savefig(fig10_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Saved: {fig10_path}")

print(">>> Task 5 pipeline finished successfully!")
