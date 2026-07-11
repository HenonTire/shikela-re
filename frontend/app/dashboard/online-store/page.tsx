/**
 * @file app/dashboard/online-store/page.tsx
 * @description Online store management dashboard with plugin/module system
 * 
 * Features:
 * - Plugin/module management (enable/disable features)
 * - Theme selection and customization
 * - Domain configuration
 * - Store builder integration
 * - Performance monitoring
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, ExternalLink, Globe, Settings, Package, Mail, Search, BarChart3, Lock, ShoppingBag, Check } from 'lucide-react';
import { THEME_LIST, ThemeConfig } from '@/lib/themes';

const storePlugins = [
  {
    id: 'products',
    name: 'Product Catalog',
    description: 'Display and manage your products',
    icon: ShoppingBag,
    enabled: true,
    installed: true,
  },
  {
    id: 'search',
    name: 'Smart Search',
    description: 'Help customers find products easily',
    icon: Search,
    enabled: true,
    installed: true,
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Collect emails and send campaigns',
    icon: Mail,
    enabled: false,
    installed: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Track store performance and visitors',
    icon: BarChart3,
    enabled: false,
    installed: true,
  },
  {
    id: 'seo',
    name: 'SEO Tools',
    description: 'Optimize for search engines',
    icon: Search,
    enabled: true,
    installed: true,
  },
  {
    id: 'security',
    name: 'Security',
    description: 'SSL certificates and data protection',
    icon: Lock,
    enabled: true,
    installed: true,
  },
];

export default function OnlineStorePage() {
  const [domainName, setDomainName] = useState('');
  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState('modern');
  const [storeId, setStoreId] = useState('');
  const [plugins, setPlugins] = useState(storePlugins);
  const [activeTab, setActiveTab] = useState<'overview' | 'plugins' | 'themes' | 'domains'>('overview');
  const [previewTheme, setPreviewTheme] = useState<ThemeConfig | null>(null);

  useEffect(() => {
    const storeName = localStorage.getItem('storeName') || 'mystore';
    const savedThemeId = localStorage.getItem('selectedTheme') || 'modern';
    const id = `${storeName}-${Math.random().toString(36).substr(2, 9)}`;
    
    setStoreId(id);
    setSelectedThemeId(savedThemeId);
    setDomainName(`${storeName}.shikela.app`);
    
    // Load saved plugins state
    const savedPlugins = localStorage.getItem('storePlugins');
    if (savedPlugins) {
      setPlugins(JSON.parse(savedPlugins));
    }
  }, []);

  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    localStorage.setItem('selectedTheme', themeId);
    
    // Dispatch custom event so storefront can listen for changes
    const event = new CustomEvent('themeChanged', { detail: { themeId } });
    window.dispatchEvent(event);
  };

  const togglePlugin = (pluginId: string) => {
    const updated = plugins.map(p =>
      p.id === pluginId ? { ...p, enabled: !p.enabled } : p
    );
    setPlugins(updated);
    localStorage.setItem('storePlugins', JSON.stringify(updated));
  };

  const getStoreUrl = () => {
    return `/store/${storeId}`;
  };

  const enabledPluginsCount = plugins.filter(p => p.enabled).length;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Online Store Management</h1>
          <p className="text-gray-600 mt-1">Manage store features, appearance, and settings</p>
        </div>
        <Link href={getStoreUrl()}>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
            <Eye className="w-4 h-4" />
            View your store
          </Button>
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'plugins', label: 'Plugins & Features' },
          { id: 'themes', label: 'Themes' },
          { id: 'domains', label: 'Domain & DNS' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          {/* Store Status */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Store Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Live
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Features</span>
                <span className="font-semibold text-gray-900">{enabledPluginsCount}/{plugins.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Theme</span>
                <span className="font-semibold text-gray-900 capitalize">{selectedThemeId}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/online-store/builder">
                <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4" />
                  Design Store
                </Button>
              </Link>
              <Link href="/dashboard/online-store/pages">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Package className="w-4 h-4" />
                  Manage Pages
                </Button>
              </Link>
              <Link href={getStoreUrl()}>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <ExternalLink className="w-4 h-4" />
                  View Store
                </Button>
              </Link>
            </div>
          </Card>

          {/* Store Settings */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Store Domain</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400" />
                <span className="font-medium text-gray-900 truncate">{domainName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setActiveTab('domains')}
              >
                Configure Domain
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Plugins Tab */}
      {activeTab === 'plugins' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Features & Plugins</h2>
            <p className="text-gray-600">Enable or disable features for your online store</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {plugins.map((plugin) => {
              return (
                <Card
                  key={plugin.id}
                  className={`p-6 transition-all ${plugin.enabled ? 'border-blue-200 bg-blue-50' : 'bg-gray-50'}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${plugin.enabled ? 'bg-blue-100' : 'bg-gray-200'}`}>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
                        <p className="text-sm text-gray-600">{plugin.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePlugin(plugin.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        plugin.enabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          plugin.enabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {plugin.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Themes Tab */}
      {activeTab === 'themes' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Themes</h2>
            <p className="text-gray-600">Select a professionally designed theme for your online store. Changes apply immediately to your live storefront.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {THEME_LIST.map((theme) => (
              <Card
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`overflow-hidden cursor-pointer transition-all border-2 ${
                  selectedThemeId === theme.id
                    ? 'border-blue-600 ring-2 ring-blue-300'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Theme Preview */}
                <div 
                  className={`h-40 bg-gradient-to-r relative`}
                  style={{
                    backgroundImage: `linear-gradient(to right, ${theme.preview.colors[0]}, ${theme.preview.colors[1]})`,
                  }}
                >
                  {selectedThemeId === theme.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-full p-3">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme Info */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{theme.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{theme.description}</p>

                  {/* Color Preview Dots */}
                  <div className="flex gap-2 mb-4">
                    {Object.values(theme.colors).slice(0, 3).map((color, idx) => (
                      typeof color === 'string' && !color.includes('.') && (
                        <div
                          key={idx}
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      )
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full transition-colors ${
                      selectedThemeId === theme.id
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                    onClick={() => handleThemeChange(theme.id)}
                  >
                    {selectedThemeId === theme.id ? 'Active Theme' : 'Apply Theme'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Theme Info Card */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Live Preview</h4>
            <p className="text-sm text-blue-800 mb-3">
              Click "View Store" to see your selected theme on your live storefront. Changes are applied instantly across all pages.
            </p>
            <Link href={getStoreUrl()}>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Eye className="w-4 h-4" />
                View Live Store
              </Button>
            </Link>
          </Card>
        </div>
      )}

      {/* Domain Tab */}
      {activeTab === 'domains' && (
        <div className="grid grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Default Domain</h3>
            {!isEditingDomain ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-600">Your store domain</p>
                    <p className="font-medium text-gray-900">{domainName}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditingDomain(true)}
                >
                  Change Domain
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="mydomain.shikela.app"
                  className="border-gray-300"
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      if (customDomain) {
                        setDomainName(customDomain);
                        setCustomDomain('');
                        setIsEditingDomain(false);
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsEditingDomain(false);
                      setCustomDomain('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">DNS Settings</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Nameserver 1</p>
                <p className="font-mono text-gray-900">ns1.shikela.app</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Nameserver 2</p>
                <p className="font-mono text-gray-900">ns2.shikela.app</p>
              </div>
              <Button variant="outline" className="w-full mt-2">
                Copy DNS Records
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
