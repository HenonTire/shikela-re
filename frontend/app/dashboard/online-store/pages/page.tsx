'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

interface StorePage {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: string;
}

export default function PagesPage() {
  const [pages, setPages] = useState<StorePage[]>([
    {
      id: '1',
      title: 'Home',
      slug: 'home',
      content: 'Welcome to our store',
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'About Us',
      slug: 'about',
      content: 'Learn about our store',
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Contact',
      slug: 'contact',
      content: 'Get in touch with us',
      isPublished: true,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '', content: '' });

  useEffect(() => {
    localStorage.setItem('storePages', JSON.stringify(pages));
  }, [pages]);

  const handleAddPage = () => {
    if (!formData.title || !formData.slug) return;

    const newPage: StorePage = {
      id: editingId || `page_${Date.now()}`,
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      isPublished: true,
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      setPages(prev => prev.map(p => (p.id === editingId ? newPage : p)));
      setEditingId(null);
    } else {
      setPages([...pages, newPage]);
    }

    setFormData({ title: '', slug: '', content: '' });
    setShowForm(false);
  };

  const handleEdit = (page: StorePage) => {
    setFormData({ title: page.title, slug: page.slug, content: page.content });
    setEditingId(page.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setPages(prev => prev.filter(p => p.id !== id));
    }
  };

  const togglePublish = (id: string) => {
    setPages(prev =>
      prev.map(p => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Pages</h1>
          <p className="text-gray-600 mt-1">Create and manage your store's pages</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: '', slug: '', content: '' });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Plus className="w-4 h-4" />
          New Page
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6 bg-blue-50 border-2 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Page' : 'Create New Page'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Page Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., About Us"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">URL Slug</label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., about-us"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from title if left blank</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your page content here..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ title: '', slug: '', content: '' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddPage} className="bg-blue-600 hover:bg-blue-700">
                {editingId ? 'Update Page' : 'Create Page'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Pages List */}
      <div className="grid gap-4">
        {pages.length > 0 ? (
          pages.map(page => (
            <Card key={page.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{page.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        page.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    URL: <code className="bg-gray-100 px-2 py-1 rounded">/{page.slug}</code>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{page.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => togglePublish(page.id)}
                  >
                    {page.isPublished ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(page)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(page.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-600">No pages created yet. Click "New Page" to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
