import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// projects.json dosyasının yolu (public klasörü içinde)
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'projects.json');

// Mevcut projeleri okuma fonksiyonu
async function getProjects() {
  try {
    const jsonData = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    // Dosya yoksa veya okunamıyorsa boş array döndür
    if (error.code === 'ENOENT') {
      return [];
    }
    console.error('Error reading projects file:', error);
    throw new Error('Projeler okunurken bir hata oluştu.');
  }
}

// Projeleri dosyaya yazma fonksiyonu
async function saveProjects(projects) {
  try {
    const jsonData = JSON.stringify(projects, null, 2); // Düzgün formatlama için null, 2
    await fs.writeFile(dataFilePath, jsonData, 'utf-8');
  } catch (error) {
    console.error('Error writing projects file:', error);
    throw new Error('Projeler kaydedilirken bir hata oluştu.');
  }
}

// POST isteğini işleme (Yeni proje ekleme)
export async function POST(request) {
  try {
    const newProject = await request.json();

    // Basit doğrulama (Gerekirse daha detaylı yapılabilir)
    if (!newProject.title || !newProject.description || !newProject.tech) {
      return NextResponse.json({ message: 'Başlık, açıklama ve teknolojiler zorunludur.' }, { status: 400 });
    }

    const projects = await getProjects();
    projects.push(newProject); // Yeni projeyi listeye ekle
    await saveProjects(projects); // Güncel listeyi dosyaya yaz

    return NextResponse.json(newProject, { status: 201 }); // Eklenen projeyi ve 201 Created statusunu döndür
  } catch (error) {
    console.error('[API/PROJECTS POST] Error:', error);
    return NextResponse.json({ message: error.message || 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}

// GET isteğini işleme (Tüm projeleri listeleme - İleride gerekebilir)
export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[API/PROJECTS GET] Error:', error);
    return NextResponse.json({ message: error.message || 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}