// auth.js — اتصال به Supabase برای لاگین، ثبت‌نام، و تشخیص نقش کاربر
// این فایل رو توی <head> صفحه، بعد از لود شدن کتابخانه‌ی supabase-js صدا بزن

const SUPABASE_URL = "https://iflmtnrpiwbhlswrufam.supabase.co";
const SUPABASE_KEY = "sb_publishable_rV7JPD8lcJIJV4BJhbgl3g_mhXiYluz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ثبت‌نام کاربر جدید (دانش‌آموز یا مشاور) — نقش همه اولش «student» می‌شه؛
// ارتقا به advisor یا admin فقط دستی و توسط خودت از پنل Supabase انجام می‌شه
async function signUpUser(email, password, fields) {
  // fields: { firstName, lastName, phone, age, fieldOfStudy, gradeLevel }
  // برای مشاور: age / fieldOfStudy / gradeLevel رو null بفرست
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: `${fields.firstName} ${fields.lastName}`,
        first_name: fields.firstName,
        last_name: fields.lastName,
        age: fields.age ?? null,
        phone: fields.phone,
        field_of_study: fields.fieldOfStudy ?? null,
        grade_level: fields.gradeLevel ?? null,
      },
    },
  });
  return { data, error };
}

// تکمیل اطلاعات اختیاری پروفایل (بعد از ثبت‌نام، هروقت خودش خواست)
async function updateOptionalProfile(userId, optionalFields) {
  // optionalFields: { gpa, konkurPercentages, rank, targetMajors, city, region }
  const { data, error } = await supabaseClient
    .from("profiles")
    .update({
      gpa: optionalFields.gpa,
      konkur_percentages: optionalFields.konkurPercentages,
      rank: optionalFields.rank,
      target_majors: optionalFields.targetMajors,
      city: optionalFields.city,
      region: optionalFields.region,
    })
    .eq("id", userId);
  return { data, error };
}

// ورود کاربر (دانش‌آموز، مشاور، یا مدیر — نقشش بعد از ورود مشخص می‌شه)
async function signIn(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  return { data, error };
}

// خروج از حساب
async function signOut() {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
}

// گرفتن اطلاعات کاربر لاگین‌شده + نقشش
async function getCurrentUserProfile() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return { ...profile, email: user.email };
}

// شنونده‌ی تغییر وضعیت لاگین — برای آپدیت خودکار صفحه وقتی کاربر وارد/خارج می‌شه
function onAuthChange(callback) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
