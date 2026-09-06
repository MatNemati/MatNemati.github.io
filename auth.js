// auth.js — اتصال به Supabase برای لاگین، ثبت‌نام، و تشخیص نقش کاربر
// این فایل رو توی <head> صفحه، بعد از لود شدن کتابخانه‌ی supabase-js صدا بزن

const SUPABASE_URL = "https://iflmtnrpiwbhlswrufam.supabase.co";
const SUPABASE_KEY = "sb_publishable_rV7JPD8lcJIJV4BJhbgl3g_mhXiYluz";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ثبت‌نام دانش‌آموز جدید — نقشش خودکار «student» می‌شه (طبق trigger که ساختیم)
async function signUpStudent(email, password, fullName) {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
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
