import { NextResponse } from 'next/server';
import { put, head, del } from '@vercel/blob';

// Vercel Blob Storage'daki anahtar
const PROJECTS_BLOB_KEY = 'projects.json';

// Mevcut projeleri Blob Storage'dan okuma fonksiyonu
async function getProjects() {
  try {
    // Blob'un varlığını kontrol et
    const blob = await head(PROJECTS_BLOB_KEY);

    // Blob varsa, içeriğini fetch et ve JSON olarak parse et
    const response = await fetch(blob.url);
    if (!response.ok) {
      // Fetch sırasında bir hata olursa
      throw new Error(`Blob içeriği alınamadı: ${response.statusText}`);
    }
    const projects = await response.json();
    return projects;

  } catch (error) {
    // head işlemi blob'u bulamadığında belirli bir hata mesajı fırlatıyor
    if (error && error.message === 'Vercel Blob: The requested blob does not exist') {
      // Blob yoksa boş array döndür
      console.log('Projects blob not found, returning empty array.');
      return [];
    }
    // Diğer beklenmedik hataları logla ve yeniden fırlat
    console.error('Unexpected error reading projects from Blob Storage:', error);
    throw new Error('Projeler okunurken bir hata oluştu.');
  }
}

// Projeleri Blob Storage'a yazma fonksiyonu
async function saveProjects(projects) {
  try {
    const jsonData = JSON.stringify(projects, null, 2);
    // Projeleri Blob Storage'a yaz (varsa üzerine yazar)
    await put(PROJECTS_BLOB_KEY, jsonData, {
      access: 'public', // 'public' veya 'private' erişim seviyesini ihtiyaca göre ayarlayın
      contentType: 'application/json', // İçerik tipini belirtmek iyi bir pratiktir
    });
    console.log('Projects successfully saved to Blob Storage.');
  } catch (error) {
    console.error('Error writing projects to Blob Storage:', error);
    throw new Error('Projeler kaydedilirken bir hata oluştu.');
  }
}

// POST isteğini işleme (Yeni proje ekleme)
export async function POST(request) {
  try {
    const newProject = await request.json();

    // Basit doğrulama
    if (!newProject.title || !newProject.description || !newProject.tech) {
      return NextResponse.json({ message: 'Başlık, açıklama ve teknolojiler zorunludur.' }, { status: 400 });
    }

    const projects = await getProjects();
    projects.push(newProject);
    await saveProjects(projects);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('[API/PROJECTS POST] Error:', error);
    // saveProjects veya getProjects'ten gelen özel mesajı kullan, yoksa genel mesaj ver
    const errorMessage = error instanceof Error ? error.message : 'Sunucu hatası oluştu.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// GET isteğini işleme (Tüm projeleri listeleme)
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API/PROJECTS GET] Error:', error);
    // getProjects'ten gelen özel mesajı kullan, yoksa genel mesaj ver
    const errorMessage = error instanceof Error ? error.message : 'Sunucu hatası oluştu.';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// İleride proje silme veya güncelleme için DEL veya PUT/PATCH metodları eklenebilir
// Örnek DEL metodu:
// export async function DELETE(request) {
//   // ... kimlik doğrulama ve yetkilendirme ...
//   const { searchParams } = new URL(request.url);
//   const projectId = searchParams.get('id');
//   if (!projectId) {
//     return NextResponse.json({ message: 'Proje ID gereklidir.' }, { status: 400 });
//   }
//   try {
//     let projects = await getProjects();
//     const initialLength = projects.length;
//     projects = projects.filter(p => p.id !== projectId); // Projelerin bir 'id' alanı olduğunu varsayalım
//     if (projects.length === initialLength) {
//       return NextResponse.json({ message: 'Proje bulunamadı.' }, { status: 404 });
//     }
//     await saveProjects(projects);
//     return NextResponse.json({ message: 'Proje başarıyla silindi.' });
//   } catch (error) {
//     console.error('[API/PROJECTS DELETE] Error:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Sunucu hatası oluştu.';
//     return NextResponse.json({ message: errorMessage }, { status: 500 });
//   }
// }