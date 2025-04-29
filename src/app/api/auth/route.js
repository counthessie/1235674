import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Environment variable'lardan doğru kullanıcı adı ve şifreyi al
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Gelen bilgilerle karşılaştır
    if (username === correctUsername && password === correctPassword) {
      // Başarılı giriş
      // İleride daha güvenli bir yöntem (örn. JWT token) kullanılabilir,
      // şimdilik basit bir başarı mesajı döndürelim.
      return NextResponse.json({ success: true, message: 'Giriş başarılı!' });
    } else {
      // Başarısız giriş
      return NextResponse.json({ success: false, message: 'Geçersiz kullanıcı adı veya şifre.' }, { status: 401 });
    }
  } catch (error) {
    console.error('[API/AUTH POST] Error:', error);
    return NextResponse.json({ success: false, message: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}