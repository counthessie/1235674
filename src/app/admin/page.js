'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Giriş durumu
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // Giriş hatası
  const [loginLoading, setLoginLoading] = useState(false); // Giriş yüklenme durumu

  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '', tech: '', githubLink: '' });
  const [loading, setLoading] = useState(true); // Proje yüklenme durumu
  const [error, setError] = useState(null); // Proje ekleme/listeleme hatası
  const [saving, setSaving] = useState(false); // Kaydetme durumu için state

  // Projeleri yükle (sadece giriş yapıldıysa)
  useEffect(() => {
    if (!isAuthenticated) return; // Giriş yapılmadıysa yükleme

    fetch('/data/projects.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Projeler yüklenemedi');
        }
        return response.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [isAuthenticated]); // isAuthenticated değiştiğinde tekrar kontrol et

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.message || 'Giriş başarısız.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Giriş sırasında bir hata oluştu.');
    } finally {
      setLoginLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setSaving(true); // Kaydetme işlemi başladı
    setError(null); // Önceki hataları temizle

    // Tech stack'i virgülle ayrılmış string'den array'e çevir
    const techArray = newProject.tech.split(',').map(t => t.trim()).filter(t => t);

    const projectToAdd = {
      id: Date.now(), // Basit bir ID oluşturma yöntemi
      ...newProject,
      tech: techArray,
    };

    try {
      const response = await fetch('/api/projects', { // API endpoint'ine istek gönder
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectToAdd),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Proje eklenirken bir hata oluştu.');
      }

      const addedProject = await response.json();
      setProjects(prev => [...prev, addedProject]); // Projeyi state'e ekle
      setNewProject({ title: '', description: '', tech: '', githubLink: '' }); // Formu temizle
    } catch (err) {
      console.error('Error adding project:', err);
      setError(err.message);
    } finally {
      setSaving(false); // Kaydetme işlemi bitti
    }
  };

  // Giriş yapılmadıysa giriş formunu göster
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <form onSubmit={handleLogin} className="p-8 bg-black/30 backdrop-blur-md rounded-lg shadow-lg border border-code-green/10 w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-code-green">Admin Girişi</h1>
          {loginError && <p className="text-red-500 text-sm mb-4 text-center">{loginError}</p>}
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-300">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-code-green text-white"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-300">Şifre</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-code-green text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loginLoading}
            className={`w-full px-4 py-2 rounded ${loginLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-code-green hover:bg-code-green/80'} text-black font-semibold transition-colors`}
          >
            {loginLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    );
  }

  // Giriş yapıldıysa ve projeler yükleniyorsa
  if (loading) return <div className="text-center py-10 text-white">Projeler yükleniyor...</div>;
  // Giriş yapıldıysa ve proje yükleme/ekleme hatası varsa
  if (error) return <div className="text-center py-10 text-red-500">Hata: {error}</div>; // Bu hata proje işlemleriyle ilgili

  // Giriş yapıldıysa admin panelini göster
  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-3xl font-bold mb-8 text-code-green">Admin Paneli - Projeler</h1>

      {/* Yeni Proje Ekleme Formu */}
      <form onSubmit={handleAddProject} className="mb-12 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-code-green/10">
        <h2 className="text-2xl font-semibold mb-4">Yeni Proje Ekle</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Hata mesajını göster */}
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 text-sm font-medium">Başlık</label>
          <input
            type="text"
            id="title"
            name="title"
            value={newProject.title}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-code-green"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 text-sm font-medium">Açıklama</label>
          <textarea
            id="description"
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-code-green"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="tech" className="block mb-1 text-sm font-medium">Kullanılan Teknolojiler (Virgülle ayırın)</label>
          <input
            type="text"
            id="tech"
            name="tech"
            value={newProject.tech}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-code-green"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="githubLink" className="block mb-1 text-sm font-medium">GitHub Linki (Opsiyonel)</label>
          <input
            type="url"
            id="githubLink"
            name="githubLink"
            value={newProject.githubLink}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-code-green"
          />
        </div>
        <button
          type="submit"
          disabled={saving} // Kaydetme sırasında butonu devre dışı bırak
          className={`px-4 py-2 rounded ${saving ? 'bg-gray-600 cursor-not-allowed' : 'bg-code-green hover:bg-code-green/80'} text-black font-semibold transition-colors`}
        >
          {saving ? 'Kaydediliyor...' : 'Projeyi Ekle'}
        </button>
      </form>

      {/* Mevcut Projeler Listesi */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Mevcut Projeler</h2>
        {projects.length === 0 ? (
          <p>Henüz proje eklenmemiş.</p>
        ) : (
          <ul className="space-y-4">
            {projects.map(project => (
              <li key={project.id} className="p-4 bg-black/10 backdrop-blur-sm rounded border border-code-green/5">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-400 mt-1">{project.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tech.map(t => (
                    <span key={t} className="text-xs bg-code-green/10 text-code-green px-2 py-1 rounded">{t}</span>
                  ))}
                </div>
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline mt-2 inline-block">
                    GitHub'da Gör
                  </a>
                )}
                {/* Silme butonu eklenebilir */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}