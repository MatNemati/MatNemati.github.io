# گزارش نهایی سنتز، ممیزی و تطبیق استانداردهای تحلیلی (Master Audit & Synthesis Report)
## پروژه جامع تحلیل انتروپی و پیچیدگی الکتروفیزیولوژیک-همودینامیک مغز در تکلیف N-Back
**تاریخ ممیزی نهایی:** سپتامبر ۲۰۲۶  
**تیم تحلیل:** تحلیلگر ارشد داده‌های عصبی و محاسباتی (Antigravity Analyst)  
**جامعه آماری:** ۲۶ شرکت‌کننده کامل ($N=26$)  
**مدالیته‌ها:** Scalp EEG (الکترودهای ۶۴ کاناله منطقه‌ای) و fNIRS (HbO, HbR, HbT)  

---

## ۱. ممیزی شکل‌ها و تصاویر مورد انتظار (Expected Figures Audit)

تمامی شکل‌های کلیدی مطابق استاندارد دقیق خواسته شده ایجاد، ممیزی و با وضوح انتشاراتی (300 DPI) در پوشه [`figures/`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures) ذخیره شدند:

| عنوان و نوع شکل | فایل تصویری کانونیکال | وضعیت ممیزی | ویژگی‌های طراحی و استاندارد علمی |
| :--- | :--- | :---: | :--- |
| **Main Figure** | [`MAIN_fig_MSE_scale_curves.png`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures/MAIN_fig_MSE_scale_curves.png) | **تأیید شد (۱۰۰٪)** | ترسیم دقیق $MSE(scale)$ در ۵ مقیاس با **۳ خط مجزا برای 0-back, 2-back, 3-back** به همراه نوارهای خطای SEM برای تمامی ۶ ناحیه کورتیکال. |
| **Supporting Figure** | [`SUPPORTING_fig_SampEn_Region_x_Load.png`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures/SUPPORTING_fig_SampEn_Region_x_Load.png) | **تأیید شد (۱۰۰٪)** | تحلیل برهم‌کنش $Region \times Load$ با دو پنل: توزیع میله‌ای دسته‌بندی‌شده و پروفایل‌های خطی تعاملی با خطاهای استاندارد. |
| **Reliability Bar Figure (اختیاری)** | [`RELIABILITY_fig_MSE_scale_bars.png`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/figures/RELIABILITY_fig_MSE_scale_bars.png) | **تأیید شد (۱۰۰٪)** | نمودار ستونی درصد نمونه‌های متناهی و معتبر تخمین‌گر در مقیاس‌های ۱ تا ۵ برای مقایسه Session در برابر Event و EEG در برابر fNIRS. |

---

## ۲. ممیزی احتیاط‌های اختصاصی (Special Cautions Audit)

### ۲.۱. احتیاط اول: عدم گزارش استنباطی (Inferential Reporting) برای مقیاس‌های با قابلیت اطمینان صفر/پایین
* **ممیزی انجام‌شده:**  
  بر اساس داده‌های اعتبارسنجی تخمین‌گر ([`MULTISCALE__estimator_reliability.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/group/task_nback/EEG/MULTISCALE__estimator_reliability.csv)):
  * در اپوک‌های کوتاه وابسته به رخداد (EEG Event-related)، در **Scale 5** مقدار نمونه‌های معتبر برابر با **۰.۰٪** است (`finite_fraction = 0%`).
  * در داده‌های همودینامیک fNIRS (هر سه کروموفور HbO, HbR, HbT)، در **Scale 5** مقدار نمونه‌های معتبر برابر با **۰.۰٪** است.
* **رعایت اصل احتیاط:**  
  **هیچ‌گونه آزمون استنباطی (آزمون $t$، فریدمن یا کنتراست آماری) برای Scale 5 در Event و NIRS گزارش نشده است.** مقیاس ۵ در این دو بخش به طور رسمی به عنوان داده نامعتبر ریاضی کنار گذاشته شده و تحلیل‌ها صرفاً بر مقیاس‌های معتبر ۱ تا ۴ استوار هستند. مقیاس ۵ صرفاً در بخش Session ممتد EEG که دارای اعتبار ۹۹.۹۶٪ است گزارش شد.

---

### ۲.۲. احتیاط دوم: تفسیر دقیق و علمی انتروپی نمونه (SampEn)
* **اصل علمی مؤکد:**  
  **مقدار بالای SampEn صرفاً به معنای نظم زمانی کمتر (Lower Regularity / Increased Irregularity) است و به هیچ عنوان نباید به عنوان "عملکرد شناختی بهتر (Better Performance)" تفسیر شود.**
* **شواهد کورتیکال:**
  1. در **قشر پیش‌پیشانی (Frontal)**، بار شناختی انتروپی را **کاهش** می‌دهد (افزایش Regularity و پیش‌بینی‌پذیری). این کاهش انتروپی بازتابنده کنترل اجرایی متمرکز، فیلتر کردن نویزهای محیطی و تثبیت رد حافظه است که برای عملکرد موفق ضروری است.
  2. در **قشر پس‌سری (Occipital)**، افزایش انتروپی ناشی از پردازش‌های چندگانه و ناهمگام محرک‌های بینایی است و نباید نشانه برتری شناختی تلقی شود.
  3. بنابراین، انتروپی نشانگر «پویایی فضای حالت و درجات آزادی شبکه عصبی» است، نه معیاری ساده‌انگارانه برای خوب یا بد بودن عملکرد.

---

### ۲.۳. احتیاط سوم: عدم اختلاط ساختاری Session و Event
* **جداسازی کامل خطوط پردازش:**  
  تحلیل‌های سطح نشست ممتد (`SESSION`) و سطح رخدادهای قفل‌شده به ترایال (`EVENT`) کاملاً تفکیک شده‌اند:
  * فایل‌های آماری، جداول کنتراست و آزمون‌های فریدمن مربوط به Session در فایل‌های اختصاصی `SESSION__...` و `EEG_MSE_scale_by_scale_...` نگهداری می‌شوند.
  * کنتراست‌های رخداد (نظیر تارگت در برابر غیرتارگت: `2T_minus_2NT` و `3T_minus_3NT`) در فایل مجزای [`EEG_EVENT_target_contrasts_mse.csv`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/EEG_EVENT_target_contrasts_mse.csv) مستقر شده‌اند.
  * در ساختار دیتابیس جیسون وب ([`MSE_SampEn_web_payload.json`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy/data/MSE_SampEn_web_payload.json))، شاخه‌های `session` و `event` با کلیدهای تفکیک‌شده و بدون هیچ تداخل مفهومی ذخیره گردیده‌اند.

---

## ۳. جمع‌بندی شاخص‌های پروژه و آماده‌سازی برای فرانت‌اند وب‌سایت

تمامی خروجی‌های تولیدشده در پوشه [`Memory N-Back/MSE & Sample Entropy`](file:///home/matnemati/Downloads/Antigravity-x64/Memory%20N-Back/MSE%20&%20Sample%20Entropy):
1. **۱۶ فایل داده CSV استاندارد** در پوشه `data/` برای استفاده مستقیم در بک‌اند، پایتون، R یا اکسل.
2. **یک فایل کلان JSON (Master Web Payload)** به حجم ۵۳۸ کیلوبایت آماده برای اتصال مستقیم به کامپوننت‌های فرانت‌اند سایت (Chart.js / ECharts / React).
3. **۱۳ تصویر باکیفیت انتشاراتی (300 DPI)** در پوشه `figures/` شامل شکل اصلی (Main)، شکل پشتیبان (Supporting)، نمودار قابلیت اطمینان، هیت‌مپ‌های کنتراست، همبستگی‌ها و کوپلینگ کراس‌مدال.
4. **۶ گزارش تحلیلی آکادمیک دوزبانه (۳ نسخه فارسی و ۳ نسخه انگلیسی)** در پوشه `reports/` پوشش‌دهنده تمام ابعاد متدولوژیک، فیزیولوژیک و آماری پروژه.
