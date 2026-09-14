# Comprehensive Analytical Report - Step 1: Cognitive Load & Regional Effects on Sample Entropy (SampEn)
## Multimodal Electrophysiological (EEG) and Hemodynamic (fNIRS) Complexity in N-Back Working Memory
**Analysis Date:** September 2026  
**Sample Cohort:** 26 Complete Participants ($N=26$)  
**Modalities:** Scalp EEG (64-channel regional clusters) and fNIRS (HbO, HbR, HbT chromophores)  
**Cognitive Paradigm:** N-Back Working Memory Task (0-back, 2-back, 3-back)  
**Cortical Topographies:** Central, Frontal, Occipital, Parietal, Temporal, WholeBrain  

---

## 1. Theoretical Framework & Neurocomputational Rationale

Sample Entropy (SampEn) serves as a model-free metric of time-series irregularity and information production rate, evaluating the conditional probability that two sequences similar for $m$ points remain similar within tolerance $r$ at the next point $m+1$.
In functional neuroimaging:
- **Elevated SampEn** denotes dynamical freedom, richer state-space exploration, and desynchronized local cortical information generation.
- **Reduced SampEn** reflects increased temporal regularity, phase-locking, periodic oscillatory entrainment, or rigorous cognitive filtering under top-down executive constraint.

**Core Analytical Objective:**  
To delineate how parametric increases in working memory load (0-back $\rightarrow$ 2-back $\rightarrow$ 3-back) modulate temporal predictability across cortical topographies, identifying specific regions of functional divergence between executive frontal networks and posterior sensory-attentional networks.

---

## 2. Electrophysiological Findings (EEG)

### 2.1. Non-Parametric Omnipresent Load Effects (Friedman ANOVA)
To detect overall load-dependent shifts across the three cognitive levels, non-parametric repeated-measures Friedman tests were evaluated per cortical region:

| Cortical Region | Friedman $\chi^2$ | $p$-value | FDR $q$-global | Inference |
| :--- | :---: | :---: | :---: | :---: |
| **Frontal Cortex** | **9.3077** | **0.0095** | **0.0255** | **Statistically Significant** |
| **Occipital Cortex** | **9.0000** | **0.0111** | **0.0285** | **Statistically Significant** |
| **Parietal Cortex** | **7.4615** | **0.0240** | **0.0475** | **Statistically Significant** |
| **Central Cortex** | 2.7692 | 0.2504 | 0.2767 | Not Significant |
| **Temporal Cortex** | 1.6154 | 0.4459 | 0.4664 | Not Significant |
| **WholeBrain Average** | 2.7692 | 0.2504 | 0.2767 | Not Significant |

> **Key Takeaway:** Cognitive load modulation of EEG SampEn is strictly localized. Spatially broad spatial averaging across the whole brain completely washes out regional dynamics. The frontal, occipital, and parietal lobes constitute the primary functional axes of entropy regulation.

---

### 2.2. Directional Dynamics and Paired Load Contrasts
Paired directional contrast analyses (0-to-2, 0-to-3, 2-to-3) reveal clear spatial dissociation:

#### A) Frontal Cortex: Load-Driven Regularity and Neural Filtering
- **0-back $\rightarrow$ 2-back:**  
  - Significant decrease in SampEn: $\Delta = -0.0392 \pm 0.0798$  
  - Paired Effect Size: $d_z = -0.4915$ (Moderate-to-large effect)  
  - Paired $t$-test: $t(25) = -2.5060, p = 0.0191, q_{\text{FDR}} = 0.0469$  
  - Wilcoxon Signed-Rank: $W = 84.0, p = 0.0190$
- **0-back $\rightarrow$ 3-back:**  
  - Trend toward continued suppression: $\Delta = -0.0300, d_z = -0.3969, t(25) = -2.0238, p = 0.0538$
- **2-back $\rightarrow$ 3-back:**  
  - Mild regulatory rebound: $\Delta = +0.0092, d_z = +0.3884, p = 0.0588$

> **Neurocomputational Insight:** Engaging in active working memory matching (0-to-2) drives prefrontal electrophysiology toward **greater regularity (lower entropy)**. This reflects top-down attentional focusing, recruitment of theta-band phase synchronization, and suppression of background stochastic cortical noise to maintain task representations.

#### B) Occipital Cortex: Marked Elevation of Visual Processing Complexity
- **0-back $\rightarrow$ 2-back:**  
  - Robust SampEn Increase: $\Delta = +0.0398 \pm 0.0640$  
  - Paired Effect Size: $d_z = +0.6230$ (Large effect)  
  - Paired $t$-test: $t(25) = 3.1766, p = 0.0039, q_{\text{FDR}} = 0.0179$
- **0-back $\rightarrow$ 3-back:**  
  - Substantial SampEn Increase: $\Delta = +0.0473 \pm 0.0659$  
  - Paired Effect Size: $d_z = +0.7175$ (Very large effect)  
  - Paired $t$-test: $t(25) = 3.6588, p = 0.0012, q_{\text{FDR}} = 0.0087$
- **2-back $\rightarrow$ 3-back:**  
  - Continued incremental complexity: $\Delta = +0.0075, d_z = +0.4199, t(25) = 2.1413, p = 0.0422$

> **Neurocomputational Insight:** Visual cortex exhibits an inverse trajectory compared to frontal cortex. High memory loads provoke rich, desynchronized information flow as visual areas continuously cycle through input buffer updates, target verification, and rapid template comparison.

#### C) Parietal Cortex: The 2-to-3 Back Overload Transition
- **0-back $\rightarrow$ 2-back:**  
  - Modest non-significant shift: $\Delta = +0.0181, d_z = +0.2979, p = 0.1413$
- **0-back $\rightarrow$ 3-back:**  
  - Significant elevation: $\Delta = +0.0295, d_z = +0.4613, t(25) = 2.3524, p = 0.0268$
- **2-back $\rightarrow$ 3-back:**  
  - **Pronounced Complexity Surge:** $\Delta = +0.0113 \pm 0.0152$  
  - Paired Effect Size: $d_z = +0.7451$  
  - Paired $t$-test: $t(25) = 3.7992, p = 0.00083, q_{\text{FDR}} = 0.0078$  
  - Wilcoxon Signed-Rank: $W = 49.0, p = 0.00075$

> **Neurocomputational Insight:** The posterior parietal cortex (dorsal attention network hub) exhibits an acute non-linear surge specifically when transitioning from 2-back to 3-back. This represents the neural signature of working memory buffer manipulation approaching individual executive capacity boundaries.

---

## 3. Hemodynamic Dynamics (fNIRS Chromophores: HbO, HbR, HbT)

Analysis of vascular entropy across oxygenated, deoxygenated, and total hemoglobin captures complementary metabolic constraints:

| Chromophore | Frontal ($\chi^2, p$) | Parietal ($\chi^2, p$) | WholeBrain ($\chi^2, p$) |
| :--- | :---: | :---: | :---: |
| **HbO (Oxy-Hemoglobin)** | $\chi^2 = 12.00, p = 0.0025^*$ | $\chi^2 = 7.92, p = 0.0190^*$ | $\chi^2 = 10.23, p = 0.0060^*$ |
| **HbR (Deoxy-Hemoglobin)** | $\chi^2 = 11.08, p = 0.0039^*$ | $\chi^2 = 2.15, p = 0.3406$ | $\chi^2 = 7.46, p = 0.0240^*$ |
| **HbT (Total-Hemoglobin)** | $\chi^2 = 7.00, p = 0.0302^*$ | $\chi^2 = 9.54, p = 0.0085^*$ | $\chi^2 = 7.00, p = 0.0302^*$ |

### Biphasic Hemodynamic Saturation in Frontal HbO:
- **0-back to 2-back:** Vascular complexity increases ($d_z = +0.4233, t = 2.158, p = 0.0407$).
- **2-back to 3-back:** **Marked reduction in hemodynamic SampEn** ($d_z = -0.7371, t = -3.758, p = 0.00092, q_{\text{FDR}} = 0.0295$).
- **Physiological Mechanism:** Under severe cognitive overload (3-back), prefrontal vascular regulation reaches sustained vasodilation and ceiling saturation, compressing the dynamic variance and reducing information entropy in the slow hemodynamic time series.

---

## 4. Generated Artifacts & Visualizations

All visual artifacts are saved in high resolution (300 DPI) inside `figures/`:
1. **`fig1_eeg_sampen_load_profiles.png`:** Regional cognitive load trajectories displaying group means $\pm$ SEM with individual participant paths ($N=26$).
2. **`fig2_eeg_sampen_effect_sizes.png`:** Standardized effect size ($d_z$) forest plot with 95% confidence intervals and statistical significance indicators.
3. **`fig3_nirs_sampen_chromophores.png`:** Multi-panel comparative analysis of HbO, HbR, and HbT across load levels and regions.
4. **`fig4_eeg_vs_nirs_significance_map.png`:** Multimodal sensitivity map demonstrating Friedman $\chi^2$ metrics against the critical significance threshold ($\chi^2 \geq 5.99$).

---

## 5. Web Deployment & Dashboard Payload

The data payload for seamless integration into your web application is stored at:
[`Memory N-Back/MSE & Sample Entropy/data/SampEn_web_payload.json`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/SampEn_web_payload.json)

It provides formatted arrays and pre-computed statistical tables ready for consumption by React, Vue, or Vanilla JS charting components.

---

## 6. Summary of Step 1 Milestones
- Extraction and standardization of EEG and fNIRS Sample Entropy datasets completed without assumptions.
- Established the double dissociation between prefrontal regularity enhancement and posterior complexity surges.
- Documented hemodynamic saturation effects at high loads.
- Structured web-ready data and bilingual academic reports prepared.
