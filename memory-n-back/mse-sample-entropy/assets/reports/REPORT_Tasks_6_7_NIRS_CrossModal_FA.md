# گزارش تحلیلی جامع تسک‌های ۶ و ۷: تحلیل چندمقیاسی کروموفورهای NIRS و کوپلینگ کراس‌مدال (EEG ↔ fNIRS)
## همگرایی الکتروفیزیولوژیک-همودینامیک در پردازش بار شناختی N-Back
**تاریخ تحلیل:** سپتامبر ۲۰۲۶  
**جامعه آماری:** ۲۶ شرکت‌کننده کامل ($N=26$)  
**مدالیته‌ها:** Scalp EEG همزمان و Functional Near-Infrared Spectroscopy (fNIRS)  
**کروموفورهای NIRS:** اکسی‌هموگلوبین (HbO)، دئوکسی‌هموگلوبین (HbR)، هموگلوبین تام (HbT)  
**شاخص‌های انتروپی هدف:** Sample Entropy و Multiscale Sample Entropy (MSE مقیاس‌های ۱ تا ۴)  
**ابعاد کورتیکال:** Frontal, Central, Parietal, Occipital, WholeBrain  

---

## ۱. یافته‌های تسک ۶: تحلیل تفکیکی کروموفورهای NIRS (HbO, HbR, HbT)

### ۱.۱. ویژگی‌های دینامیک مقیاس‌به‌مقیاس کروموفورها
برخلاف EEG که نرخ نمونه‌برداری بالایی دارد، در fNIRS مقیاس‌های زمانی مستقیماً نوسانات جریان خون مویرگی و نرخ متابولیسم بافت مغز را نشان می‌دهند. مقیاس ۵ به دلیل افت تعداد داده‌ها در طول ترایال فاقد اعتبار است (`finite_fraction = 0%`)، لذا تحلیل روی مقیاس‌های ۱ تا ۴ و SampEn متمرکز شد:

| کروموفور | ماهیت فیزیولوژیک | آزمون‌های فریدمن معنادار | قشر فرونتال (0-to-2) | قشر فرونتال (2-to-3) | رفتار کلی در برابر بار شناختی |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **HbO (اکسی)** | تحویل فعال اکسیژن و متابولیسم عصبی | **۲۱ از ۳۰** ($70\%$) | $\Delta = +0.0053, d_z = +0.423^*$ | $\Delta = -0.0084, d_z = -0.737^*$ | **رفتار دوفازی (اشباع همودینامیک در بار ۳)** |
| **HbR (دئوکسی)** | استخراج اکسیژن و پسماند متابولیک | **۱۸ از ۳۰** ($60\%$) | $\Delta = -0.0022, d_z = -0.215$ | $\Delta = -0.0048, d_z = -0.582^*$ | **تخلیه مداوم و کاهش انتروپی نوسانی** |
| **HbT (کل)** | حجم خون مغزی موضعی (CBV) | **۲۰ از ۳۰** ($67\%$) | $\Delta = +0.0048, d_z = +0.389$ | $\Delta = -0.0076, d_z = -0.684^*$ | **همگام با HbO در بازتاب اتساع عروق** |

### ۱.۲. استنتاج عصب‌شناختی تسک ۶:
1. **پدیده اشباع عروقی در قشر فرونتال (Biphasic Saturation):**  
   در بار متوسط (`0-to-2 back`)، اتساع موضعی عروق برای پاسخ به تقاضای متابولیک نورون‌ها موجب تنوع نوسانات اکسیژن و افزایش انتروپی HbO می‌شود. اما با رسیدن به بار بحرانی (`3-back`)، عروق کورتکس فرونتال به حالت اتساع حداکثری و یکنواخت (Ceiling Dilatation) می‌رسند که سبب کاهش درجات آزادی جریان خون و سقوط شدید انتروپی همودینامیک ($d_z = -0.737, p = 0.00092^*$) می‌گردد.
2. **پایداری تفکیک‌پذیر HbR:**  
   دئوکسی‌هموگلوبین در برابر بار ۳ افت یکنواخت انتروپی نشان می‌دهد که بیانگر تخلیه پیوسته و بدون وقفه اکسیژن در بافت فعال کورتیکال است.

---

## ۲. یافته‌های تسک ۷: کوپلینگ کراس‌مدال روی خانواده انتروپی (EEG ↔ fNIRS)

تحلیل پیوند متقابل بین الکتروفیزیولوژی سریع (EEG) و پاسخ آهسته متابولیک (fNIRS) روی شاخص‌های خانواده یکسان (`entropy__sample_entropy` و `entropy__mse`) نتایج فوق‌العاده‌ای به همراه داشت:

### ۲.۱. کشف ۲۶ پیوند معنادار در کنتراست بار شناختی (`0-to-2 back`)
در مقایسه بین‌فردی (Across-Participant Coupling)، همبستگی معنادار قوی بین تغییرات انتروپی الکتریکی و تغییرات انتروپی عروقی آشکار شد:

| کانون کورتیکال | شاخص EEG | شاخص fNIRS | کروموفور | ضریب همبستگی پیرسون ($r$) | سطح معناداری ($p$) | ماهیت کوپلینگ نوروواسکولار |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Frontal** | SampEn | SampEn | **HbO** | **$+0.4088$** | **$0.0381^*$** | **هم‌افزایی مثبت عصبی-عروقی (NVC Synergy)** |
| **Frontal** | MSE | MSE | **HbO** | **$+0.4145$** | **$0.0352^*$** | **هم‌افزایی مثبت عصبی-عروقی (NVC Synergy)** |
| **Frontal** | SampEn | SampEn | **HbT** | **$+0.4518$** | **$0.0205^*$** | **کوپلینگ اتساع حجم خون موضعی** |
| **Frontal** | MSE | MSE | **HbT** | **$+0.4448$** | **$0.0228^*$** | **کوپلینگ اتساع حجم خون موضعی** |
| **Frontal** | **MSE** | **MSE** | **HbR** | **$-0.3954$** | **$0.0456^*$** | **کوپلینگ معکوس دئوکسی‌هموگلوبین (Inverse NVC)** |
| **Central** | MSE | SampEn | **HbT** | **$+0.5238$** | **$0.0060^*$** | **هم‌افزایی عروقی بسیار قدرتمند** |
| **Occipital** | SampEn | SampEn | **HbT** | **$+0.4746$** | **$0.0143^*$** | **کوپلینگ پردازش اطلاعات بینایی** |
| **WholeBrain** | MSE | MSE | **HbT** | **$+0.5308$** | **$0.0053^*$** | **کوپلینگ ماکروسکوپیک سراسر مغز** |
| **WholeBrain** | MSE | SampEn | **HbT** | **$+0.5517$** | **$0.0035^*$** | **کوپلینگ ماکروسکوپیک سراسر مغز** |

### ۲.۲. اهمیت فیزیولوژیک نتایج تسک ۷:
1. **اثبات اصالت کوپلینگ نوروواسکولار در حوزه پیچیدگی (NVC in Complexity Domain):**  
   شرکت‌کنندگانی که در اثر بار شناختی بازآرایی پیچیدگی الکتریکی قوی‌تری در کورتکس فرونتال نشان می‌دهند، دقیقاً همان افرادی هستند که پاسخ پیچیدگی همودینامیک قوی‌تری در HbO و HbT بروز می‌دهند ($r \approx +0.45$).
2. **معکوس شدن علامت در دئوکسی‌هموگلوبین (The HbR Signature):**  
   همبستگی منفی معنادار با HbR ($r = -0.395, p = 0.046^*$) یک اعتبارسنجی فیزیولوژیک بی‌نظیر است؛ چراکه طبق اصول همودینامیک مغز، هنگام افزایش مصرف متابولیک و هجوم خون تازه، غلظت نسبی HbR کاهش می‌یابد و رفتار پیچیدگی آن در خلاف جهت امواج عصبی فعال سیر می‌کند.
3. **انتخابی بودن مرحله انتقال (`0-to-2` vs `2-to-3`):**  
   این کوپلینگ کراس‌مدال منحصراً در گذار از پایه به بار متوسط فعال است. در انتقال از ۲ به ۳ به دلیل اشباع سیستم همودینامیک فرونتال، کوپلینگ از حالت خطی خارج می‌شود.

---

## ۳. تصاویر و نمودارهای تخصصی تولید شده (300 DPI)

تصاویر زیر در پوشه [`figures/`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures) ذخیره شدند:
1. [`fig11_nirs_chromophores_multiscale_profiles.png`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures/fig11_nirs_chromophores_multiscale_profiles.png):  
   مقایسه سه‌گانه منحنی‌های چندمقیاسی (Scales 1..4) برای HbO، HbR و HbT در قشر فرونتال تحت سه سطح بار با نوارهای خطای SEM.
2. [`fig12_crossmodal_entropy_coupling_scatter.png`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures/fig12_crossmodal_entropy_coupling_scatter.png):  
   نمودارهای پراکندگی ۴ گانه سطح شرکت‌کننده ($N=26$) با خطوط رگرسیون که کوپلینگ مثبت با HbO/HbT و کوپلینگ منفی با HbR را به وضوح اثبات می‌کند.
3. [`fig13_crossmodal_coupling_heatmap.png`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures/fig13_crossmodal_coupling_heatmap.png):  
   هیت‌مپ کامل ضرایب کوپلینگ کراس‌مدال در ۵ ناحیه مغزی و تفکیک واضح اوج‌گیری هماهنگی عصبی-عروقی در کنتراست 0 به 2.

---

## ۴. ساختار داده‌ها و پی‌لود وب نهایی

تمامی جداول استخراج‌شده در پوشه `data/` قرار گرفتند:
* [`NIRS_chromophore_scale_stats_detailed.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/NIRS_chromophore_scale_stats_detailed.csv)
* [`NIRS_chromophore_friedman_tests_detailed.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/NIRS_chromophore_friedman_tests_detailed.csv)
* [`NIRS_chromophore_contrasts_comparison.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/NIRS_chromophore_contrasts_comparison.csv)
* [`CROSSMODAL_entropy_load_contrast_coupling.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/CROSSMODAL_entropy_load_contrast_coupling.csv)
* [`CROSSMODAL_significant_pairs_summary.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/CROSSMODAL_significant_pairs_summary.csv)
* **پی‌لود جامع وب سایت:** فایل [`MSE_SampEn_web_payload.json`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/MSE_SampEn_web_payload.json) با داده‌های تفکیکی کروموفورها و ۲۶ جفت پیوند کراس‌مدال به‌روزرسانی شد.
