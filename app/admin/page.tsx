'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  Eye,
  Package,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  Lock,
  Mail,
  LogOut,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  RotateCcw,
  Copy,
  Tag,
  Check,
} from 'lucide-react'

export type ProductStatus = 'Publicado' | 'Inativo' | 'Vendido' | 'Rascunho'

export type Product = {
  id: number
  name: string
  code: string
  category: string
  price: number
  status: ProductStatus
  stock: number
  images: string[]
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Brinco Gota Serena',
    code: 'SJ-014',
    category: 'Brincos',
    price: 129.9,
    status: 'Publicado',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 2,
    name: 'Colar Ponto de Luz',
    code: 'SJ-021',
    category: 'Colares',
    price: 159.9,
    status: 'Vendido',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 3,
    name: 'Argola Essenza',
    code: 'SJ-008',
    category: 'Brincos',
    price: 89.9,
    status: 'Inativo',
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=85',
    ],
  },
  {
    id: 4,
    name: 'Anel Solitário Aurora',
    code: 'SJ-031',
    category: 'Anéis',
    price: 139.9,
    status: 'Rascunho',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
    ],
  },
]

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function AdminPage() {
  // Autenticação Server-Side
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [adminEmail, setAdminEmail] = useState<string>('')

  // Formulário de Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Estado dos Anúncios
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Todos')

  // Modal de Adicionar/Editar
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({
    name: '',
    code: '',
    category: 'Brincos',
    price: '',
    stock: '',
    status: 'Publicado' as ProductStatus,
    images: ['', '', '', '', ''] as string[],
  })

  // Modal de Confirmação de Exclusão
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)

  // Modal de Reutilização de Anúncio Vendido/Inativo
  const [reusingProduct, setReusingProduct] = useState<Product | null>(null)
  const [reuseStock, setReuseStock] = useState<string>('1')
  const [reusePrice, setReusePrice] = useState<string>('')

  // Verificar Sessão no Servidor ao carregar a página
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/session', { cache: 'no-store' })
        const data = await res.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
          setAdminEmail(data.email || 'Admin')
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkSession()
  }, [])

  // Processo de Login Server-Side
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setLoginError(data.error || 'Credenciais inválidas. Tente novamente.')
        setIsLoggingIn(false)
        return
      }

      setIsAuthenticated(true)
      setAdminEmail(data.email)
      setLoginPassword('')
    } catch {
      setLoginError('Ocorreu um erro ao conectar ao servidor de autenticação.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Logout Server-Side
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {
      // Ignore
    }
    setIsAuthenticated(false)
    setAdminEmail('')
  }

  // Filtro de Anúncios por Busca e Status
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = `${p.name} ${p.code} ${p.category}`.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'Todos' || p.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [products, query, statusFilter])

  // Contagem por Status
  const counts = useMemo(
    () => ({
      Todos: products.length,
      Publicado: products.filter((p) => p.status === 'Publicado').length,
      Vendido: products.filter((p) => p.status === 'Vendido').length,
      Inativo: products.filter((p) => p.status === 'Inativo').length,
      Rascunho: products.filter((p) => p.status === 'Rascunho').length,
    }),
    [products]
  )

  const openNew = () => {
    setEditing(null)
    setForm({
      name: '',
      code: `SJ-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Brincos',
      price: '',
      stock: '1',
      status: 'Publicado',
      images: ['', '', '', '', ''],
    })
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    const paddedImages = [...p.images]
    while (paddedImages.length < 5) paddedImages.push('')
    setForm({
      name: p.name,
      code: p.code,
      category: p.category,
      price: String(p.price),
      stock: String(p.stock),
      status: p.status,
      images: paddedImages.slice(0, 5),
    })
    setShowForm(true)
  }

  const handleImageUrlChange = (index: number, value: string) => {
    const updated = [...form.images]
    updated[index] = value
    setForm({ ...form, images: updated })
  }

  const saveProduct = (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name || !form.code || !form.price) return

    const validImages = form.images.filter((img) => img.trim().length > 0)
    const defaultImage =
      validImages.length > 0
        ? validImages
        : ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85']

    const values = {
      name: form.name,
      code: form.code,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      status: form.status,
      images: defaultImage,
    }

    setProducts((items) =>
      editing
        ? items.map((p) => (p.id === editing.id ? { ...p, ...values } : p))
        : [{ ...values, id: Date.now() }, ...items]
    )
    setShowForm(false)
  }

  // Abrir Modal de Reutilização de Produto
  const openReuseModal = (product: Product) => {
    setReusingProduct(product)
    setReuseStock('1')
    setReusePrice(String(product.price))
  }

  // Confirmar Reutilização / Reativação de Produto Vendido ou Inativo
  const confirmReuse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reusingProduct) return

    setProducts((items) =>
      items.map((p) =>
        p.id === reusingProduct.id
          ? {
              ...p,
              status: 'Publicado',
              stock: Number(reuseStock) || 1,
              price: Number(reusePrice) || p.price,
            }
          : p
      )
    )
    setReusingProduct(null)
  }

  // Duplicar Anúncio Existente
  const duplicateProduct = (p: Product) => {
    const newProduct: Product = {
      ...p,
      id: Date.now(),
      name: `${p.name} (Cópia)`,
      code: `${p.code}-NEW`,
      status: 'Publicado',
      stock: 1,
    }
    setProducts((items) => [newProduct, ...items])
  }

  // Confirmar Exclusão de Anúncio
  const confirmDelete = () => {
    if (deletingProduct) {
      setProducts((items) => items.filter((item) => item.id !== deletingProduct.id))
      setDeletingProduct(null)
    }
  }

  // Tela de Carregando Sessão
  if (isAuthenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#6e4e3e]" />
          <p className="text-xs tracking-[0.14em] text-[#806c60] uppercase">Verificando credenciais...</p>
        </div>
      </main>
    )
  }

  // TELA DE LOGIN (Se não autenticado)
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ee] px-5 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#e5dbd0] bg-[#fbfaf7] p-8 shadow-xl sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f2ebd9] text-[#6e4e3e]">
              <Lock className="size-6" />
            </div>
            <p className="mt-4 font-serif text-2xl tracking-[0.14em] text-[#6e4e3e]">
              AUREA<span className="text-[#c3996b]">.</span>
            </p>
            <h1 className="mt-1 font-serif text-2xl text-[#49362d]">Acesso Restrito</h1>
            <p className="mt-2 text-xs text-[#88776c]">Informe suas credenciais para gerenciar a loja online.</p>
          </div>

          {loginError && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#f5c6cb] bg-[#f8d7da] p-4 text-xs text-[#721c24]">
              <AlertTriangle className="size-4 shrink-0 text-[#721c24]" />
              <p>{loginError}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                E-mail de Acesso
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 size-4 text-[#a18e80]" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu-email@exemplo.com"
                  className="w-full rounded-xl border border-[#dfd3c7] bg-white py-3 pl-10 pr-4 text-sm text-[#302521] outline-none transition focus:border-[#6e4e3e]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 size-4 text-[#a18e80]" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#dfd3c7] bg-white py-3 pl-10 pr-4 text-sm text-[#302521] outline-none transition focus:border-[#6e4e3e]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#6e4e3e] py-3.5 text-xs font-semibold tracking-[0.14em] text-white uppercase shadow-md transition hover:bg-[#583e31] disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Autenticando...
                </>
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[#eadfd5] pt-5 text-center">
            <a href="/" className="inline-flex items-center gap-2 text-xs text-[#88776c] hover:text-[#6e4e3e]">
              <ArrowLeft className="size-3.5" /> Voltar à loja principal
            </a>
          </div>
        </div>
      </main>
    )
  }

  // PAINEL ADMINISTRATIVO (Usuário Autenticado)
  return (
    <main className="min-h-screen bg-[#f7f3ee] text-[#302521]">
      {/* Cabeçalho */}
      <header className="border-b border-[#e5dbd0] bg-[#fbfaf7]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-10">
          <div className="flex items-center gap-4">
            <a
              href="/"
              aria-label="Voltar ao catálogo"
              className="flex size-9 items-center justify-center rounded-full border border-[#dfd3c7] text-[#6e4e3e] transition hover:bg-[#f2ebd9]"
            >
              <ArrowLeft className="size-4" />
            </a>
            <div>
              <p className="font-serif text-xl tracking-[0.14em] text-[#6e4e3e]">
                AUREA<span className="text-[#c3996b]">.</span>
              </p>
              <p className="text-[9px] tracking-[0.2em] text-[#a18e80] uppercase">Painel administrativo</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-[#88776c] sm:inline-block">
              Conectado como <strong className="font-medium text-[#49362d]">{adminEmail}</strong>
            </span>

            <a
              href="/"
              className="flex items-center gap-2 rounded-full border border-[#d8cabe] px-4 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#6e4e3e] uppercase transition hover:bg-[#f2ebd9]"
            >
              <Eye className="size-3.5" /> Ver catálogo
            </a>

            <button
              onClick={handleLogout}
              title="Encerrar sessão"
              className="flex items-center gap-1.5 rounded-full border border-[#e5b8b8] bg-[#fdf2f2] px-3.5 py-2 text-[10px] font-semibold tracking-[0.12em] text-[#9a3b3b] uppercase transition hover:bg-[#f8d7da]"
            >
              <LogOut className="size-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-[#b0845a] uppercase">
              <Sparkles className="size-3.5" /> Aurea Studio
            </p>
            <h1 className="font-serif text-4xl text-[#49362d]">Gestão de Anúncios</h1>
            <p className="mt-2 text-sm text-[#88776c]">
              Adicione fotos, crie novos anúncios ou reative produtos vendidos e inativos.
            </p>
          </div>

          <button
            onClick={openNew}
            className="flex items-center justify-center gap-2 rounded-full bg-[#6e4e3e] px-5 py-3 text-[10px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition hover:bg-[#583e31]"
          >
            <Plus className="size-4" /> Nova peça
          </button>
        </div>

        {/* Estatísticas */}
        <div className="mt-9 grid gap-4 sm:grid-cols-4">
          <Stat icon={<Package className="size-5" />} value={counts.Todos} label="Anúncios totais" />
          <Stat icon={<Sparkles className="size-5" />} value={counts.Publicado} label="Publicados no ar" />
          <Stat icon={<RotateCcw className="size-5" />} value={counts.Vendido + counts.Inativo} label="Vendidos / Inativos" />
          <Stat icon={<Eye className="size-5" />} value="12k+" label="Visitas no catálogo" />
        </div>

        {/* Tabela de Produtos / Anúncios */}
        <section className="mt-8 rounded-2xl border border-[#e5dbd0] bg-[#fbfaf7] p-5 sm:p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            {/* Abas de Filtro de Status */}
            <div className="flex flex-wrap items-center gap-2">
              {(['Todos', 'Publicado', 'Vendido', 'Inativo', 'Rascunho'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-full px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase transition ${
                    statusFilter === st
                      ? 'bg-[#6e4e3e] text-white shadow-sm'
                      : 'border border-[#dfd3c7] bg-white text-[#806c60] hover:bg-[#f2ebd9]'
                  }`}
                >
                  {st} ({counts[st as keyof typeof counts]})
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 rounded-full border border-[#dfd3c7] bg-white px-3.5 py-2">
              <Search className="size-4 text-[#a18e80]" />
              <span className="sr-only">Buscar anúncios</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar anúncio"
                className="w-full bg-transparent text-xs text-[#302521] outline-none sm:w-44"
              />
            </label>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="border-b border-[#eadfd5] text-[10px] tracking-[0.12em] text-[#9a887b] uppercase">
                  <th className="pb-3">Peça & Fotos</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Valor</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-[#f0e8df] last:border-0 hover:bg-[#f6f1ea]">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {/* Preview da foto principal + contador de fotos */}
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-[#dfd3c7] bg-[#eee8e2]">
                          {p.images && p.images.length > 0 && p.images[0] ? (
                            <img src={p.images[0]} alt={p.name} className="size-full object-cover" />
                          ) : (
                            <div className="flex size-full items-center justify-center text-[#a18e80]">
                              <ImageIcon className="size-5" />
                            </div>
                          )}
                          <span className="absolute bottom-0 right-0 bg-[#302521]/80 px-1 py-0.5 text-[8px] font-bold text-white rounded-tl">
                            {p.images?.filter(Boolean).length || 0}/5
                          </span>
                        </div>
                        <div>
                          <p className="font-serif text-base text-[#49362d]">{p.name}</p>
                          <p className="mt-0.5 text-[10px] text-[#a18e80]">
                            {p.code} · {p.stock} em estoque
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-xs text-[#88776c]">{p.category}</td>
                    <td className="py-4 text-xs font-medium text-[#6e4e3e]">{money(p.price)}</td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase ${
                          p.status === 'Publicado'
                            ? 'bg-[#edf3e9] text-[#65805b]'
                            : p.status === 'Vendido'
                            ? 'bg-[#f4efe8] text-[#9b6e3b]'
                            : p.status === 'Inativo'
                            ? 'bg-[#eeebe8] text-[#80756c]'
                            : 'bg-[#fcf5e5] text-[#b07d2b]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        {/* Botão de Reutilizar se Vendido ou Inativo */}
                        {(p.status === 'Vendido' || p.status === 'Inativo') && (
                          <button
                            onClick={() => openReuseModal(p)}
                            className="flex items-center gap-1 rounded-full border border-[#b0845a] bg-[#fbf4ea] px-3 py-1 text-[10px] font-semibold text-[#8c5a2b] transition hover:bg-[#b0845a] hover:text-white"
                            title="Reutilizar anúncio vendido/inativo"
                          >
                            <RotateCcw className="size-3" /> Reutilizar
                          </button>
                        )}

                        {/* Duplicar */}
                        <button
                          onClick={() => duplicateProduct(p)}
                          aria-label={`Duplicar ${p.name}`}
                          className="flex size-8 items-center justify-center rounded-full border border-[#dfd3c7] text-[#6e4e3e] transition hover:bg-[#f2ebd9]"
                          title="Duplicar Anúncio"
                        >
                          <Copy className="size-3.5" />
                        </button>

                        {/* Editar */}
                        <button
                          onClick={() => openEdit(p)}
                          aria-label={`Editar ${p.name}`}
                          className="flex size-8 items-center justify-center rounded-full border border-[#dfd3c7] text-[#6e4e3e] transition hover:bg-[#6e4e3e] hover:text-white"
                          title="Editar Peça e Fotos"
                        >
                          <Pencil className="size-3.5" />
                        </button>

                        {/* Excluir com Confirmação */}
                        <button
                          onClick={() => setDeletingProduct(p)}
                          aria-label={`Excluir ${p.name}`}
                          className="flex size-8 items-center justify-center rounded-full border border-[#e5b8b8] text-[#9a3b3b] transition hover:bg-[#9a3b3b] hover:text-white"
                          title="Excluir Anúncio"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#88776c]">
                      Nenhum anúncio encontrado nesta categoria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* MODAL DE REUTILIZAÇÃO DE ANÚNCIO VENDIDO / INATIVO */}
      {reusingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302521]/50 p-5 backdrop-blur-sm">
          <form
            onSubmit={confirmReuse}
            className="w-full max-w-md rounded-2xl bg-[#fbfaf7] p-7 shadow-2xl border border-[#e5dbd0]"
          >
            <div className="flex items-center gap-3 text-[#b0845a]">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#fbf4ea]">
                <RotateCcw className="size-5 text-[#8c5a2b]" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#49362d]">Reutilizar Anúncio</h3>
                <p className="text-[10px] text-[#806c60] uppercase">Reativar peça no catálogo</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#6e5d52]">
              Você está reativando o anúncio <strong className="text-[#302521]">"{reusingProduct.name}"</strong> ({reusingProduct.code}). 
              Atualize a quantidade em estoque e o valor para colocar a peça novamente à venda:
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Novo Estoque
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={reuseStock}
                  onChange={(e) => setReuseStock(e.target.value)}
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Valor da Peça (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={reusePrice}
                  onChange={(e) => setReusePrice(e.target.value)}
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReusingProduct(null)}
                className="rounded-full border border-[#dfd3c7] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-[#6e4e3e] uppercase transition hover:bg-[#f2ebd9]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#6e4e3e] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition hover:bg-[#583e31]"
              >
                <Check className="size-3.5" /> Reativar e Publicar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE ANÚNCIO (SIM OU NÃO) */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302521]/50 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#fbfaf7] p-7 shadow-2xl border border-[#e5dbd0]">
            <div className="flex items-center gap-3 text-[#9a3b3b]">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#fdf2f2]">
                <AlertTriangle className="size-5 text-[#9a3b3b]" />
              </div>
              <h3 className="font-serif text-xl text-[#49362d]">Confirmar Exclusão</h3>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-[#6e5d52]">
              Tem certeza que deseja excluir o anúncio <strong className="text-[#302521]">"{deletingProduct.name}"</strong>?
              Esta ação removerá a peça do catálogo da loja online.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="rounded-full border border-[#dfd3c7] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-[#6e4e3e] uppercase transition hover:bg-[#f2ebd9]"
              >
                Não, cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex items-center gap-2 rounded-full bg-[#9a3b3b] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition hover:bg-[#7b2c2c]"
              >
                <CheckCircle2 className="size-3.5" /> Sim, excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ADICIONAR / EDITAR ANÚNCIO E ATÉ 5 FOTOS */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#302521]/40 p-5 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={saveProduct}
            className="my-8 w-full max-w-2xl rounded-2xl bg-[#fbfaf7] p-7 shadow-2xl border border-[#e5dbd0] max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] tracking-[0.18em] text-[#b0845a] uppercase">Aurea Studio</p>
                <h2 className="mt-1 font-serif text-3xl text-[#49362d]">
                  {editing ? 'Editar anúncio' : 'Novo anúncio'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Fechar formulário"
                className="rounded-full p-1 text-[#88776c] hover:bg-[#f2ebd9]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Dados Principais do Anúncio */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Nome da Peça
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Brinco Gota Serena"
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Código da Peça
                </label>
                <input
                  required
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="Ex: SJ-014"
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Categoria
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                >
                  <option value="Brincos">Brincos</option>
                  <option value="Colares">Colares</option>
                  <option value="Anéis">Anéis</option>
                  <option value="Pulseiras">Pulseiras</option>
                  <option value="Conjuntos">Conjuntos</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Status do Anúncio
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as ProductStatus })}
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                >
                  <option value="Publicado">Publicado (Visível na loja)</option>
                  <option value="Vendido">Vendido</option>
                  <option value="Inativo">Inativo (Oculto)</option>
                  <option value="Rascunho">Rascunho</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Preço (R$)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="129.90"
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-semibold tracking-[0.12em] text-[#806c60] uppercase">
                  Estoque Disponível
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="1"
                  className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2.5 text-sm text-[#302521] outline-none"
                />
              </div>
            </div>

            {/* Gerenciamento de Fotos (Até 5 fotos) */}
            <div className="mt-7 border-t border-[#eadfd5] pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-[#49362d]">Fotos da Peça (Até 5 fotos)</h3>
                  <p className="text-[11px] text-[#88776c]">
                    Cole a URL das fotos do anúncio ou adicione múltiplos ângulos da joia.
                  </p>
                </div>
                <span className="rounded-full bg-[#f2ebd9] px-2.5 py-1 text-[10px] font-bold text-[#6e4e3e]">
                  {form.images.filter((img) => img.trim().length > 0).length} de 5 adicionadas
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {form.images.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-16 text-[10px] font-bold text-[#b0845a] uppercase">
                      {idx === 0 ? 'Foto 1 (Capa)' : `Foto ${idx + 1}`}
                    </span>

                    {/* Miniature Preview */}
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-[#dfd3c7] bg-[#eee8e2]">
                      {url.trim() ? (
                        <img src={url} alt={`Foto ${idx + 1}`} className="size-full object-cover" />
                      ) : (
                        <div className="flex size-full items-center justify-center text-[#a18e80]">
                          <ImageIcon className="size-4" />
                        </div>
                      )}
                    </div>

                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                      placeholder={
                        idx === 0
                          ? 'https://exemplo.com/foto-principal.jpg'
                          : `https://exemplo.com/foto-angulo-${idx + 1}.jpg`
                      }
                      className="w-full rounded-lg border border-[#dfd3c7] bg-white px-3 py-2 text-xs text-[#302521] outline-none focus:border-[#6e4e3e]"
                    />

                    {url.trim() && (
                      <button
                        type="button"
                        onClick={() => handleImageUrlChange(idx, '')}
                        aria-label={`Remover Foto ${idx + 1}`}
                        className="rounded-full p-1 text-[#9a3b3b] hover:bg-[#fdf2f2]"
                        title="Remover foto"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-[#6e4e3e] py-3.5 text-[10px] font-semibold tracking-[0.12em] text-white uppercase shadow-md transition hover:bg-[#583e31]"
            >
              Salvar anúncio com fotos
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-[#e5dbd0] bg-[#fbfaf7] p-5 shadow-sm">
      <div className="text-[#6e4e3e]">{icon}</div>
      <p className="mt-4 font-serif text-3xl text-[#49362d]">{value}</p>
      <p className="mt-1 text-[10px] tracking-[0.12em] text-[#9a887b] uppercase">{label}</p>
    </div>
  )
}
