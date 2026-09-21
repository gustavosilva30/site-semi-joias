'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  Filter,
  Heart,
  Menu,
  MessageCircle,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

const products = [
  { id: 1, name: 'Brinco Gota Serena', code: 'SJ-014', category: 'Brincos', price: 129.9, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85', badge: 'Mais desejado' },
  { id: 2, name: 'Colar Ponto de Luz', code: 'SJ-021', category: 'Colares', price: 159.9, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85', badge: 'Novidade' },
  { id: 3, name: 'Argola Essenza', code: 'SJ-008', category: 'Brincos', price: 89.9, image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=85', badge: '' },
  { id: 4, name: 'Anel Solitário Aurora', code: 'SJ-031', category: 'Anéis', price: 139.9, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85', badge: 'Exclusivo' },
  { id: 5, name: 'Pulseira Elos Dourados', code: 'SJ-019', category: 'Pulseiras', price: 179.9, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85', badge: '' },
  { id: 6, name: 'Conjunto Lumière', code: 'SJ-042', category: 'Conjuntos', price: 229.9, image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85', badge: 'Coleção' },
]

const categories = ['Todos', 'Brincos', 'Colares', 'Anéis', 'Pulseiras', 'Conjuntos']
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Page() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceFilter, setPriceFilter] = useState('Todas')
  const [selected, setSelected] = useState<(typeof products)[number] | null>(null)

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory
    const matchesQuery = `${product.name} ${product.code} ${product.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesPrice = priceFilter === 'Todas' || (priceFilter === 'Até R$ 150' ? product.price <= 150 : product.price > 150)
    return matchesCategory && matchesQuery && matchesPrice
  }), [activeCategory, priceFilter, query])

  const clearFilters = () => {
    setActiveCategory('Todos')
    setPriceFilter('Todas')
    setQuery('')
  }

  const toggleFavorite = (id: number) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const whatsapp = (product?: (typeof products)[number]) => {
    const text = product ? `Olá! Vi a ${product.name} no catálogo da Le Semijoias e gostaria de saber mais.\n\nCódigo: ${product.code}\nValor: ${money(product.price)}` : 'Olá! Vi o catálogo da Le Semijoias e gostaria de conhecer as peças disponíveis.'
    window.open(`https://wa.me/5567996879494?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#2f2926]">
      <div className="bg-[#302521] px-4 py-2 text-center text-[10px] font-medium tracking-[0.18em] text-[#e9d8c1] uppercase">Frete grátis nas compras acima de R$ 199 · Atendimento personalizado pelo WhatsApp</div>
      <header className="sticky top-0 z-30 border-b border-[#e6dfd6] bg-[#fbfaf7]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-10">
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-full p-2 lg:hidden" aria-label="Abrir menu">{menuOpen ? <X /> : <Menu />}</button>
          <a href="#inicio" className="font-serif text-2xl tracking-[0.16em] text-[#6e4e3e]">LE SEMIJOIAS<span className="text-[#c3996b]">.</span></a>
          <nav className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 top-[76px] w-full flex-col gap-5 border-b border-[#e6dfd6] bg-[#fbfaf7] px-5 py-6 text-xs tracking-[0.16em] uppercase lg:static lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-8 lg:border-0 lg:bg-transparent lg:p-0`}>
            <a href="#colecao" className="text-[#6e4e3e]">Coleção</a><a href="#sobre" className="text-[#8c7a6e] hover:text-[#6e4e3e]">A Le Semijoias</a><a href="#contato" className="text-[#8c7a6e] hover:text-[#6e4e3e]">Contato</a>
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden items-center border-b border-[#cfc2b6] px-2 py-1 sm:flex"><Search className="mr-2 size-4 text-[#917c6b]" /><input aria-label="Pesquisar" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar uma peça" className="w-32 bg-transparent text-xs outline-none placeholder:text-[#a99b91]" /></div>
            <button onClick={() => whatsapp()} className="flex items-center gap-2 rounded-full bg-[#6e4e3e] px-4 py-2.5 text-[10px] font-semibold tracking-[0.1em] text-white uppercase"><MessageCircle className="size-3.5" /> <span className="hidden sm:inline">Falar conosco</span></button>
          </div>
        </div>
      </header>

      <section id="inicio" className="mx-auto grid max-w-7xl gap-8 px-5 pb-14 pt-8 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-10 lg:pb-24 lg:pt-14">
        <div className="order-2 lg:order-1 lg:pl-12"><div className="mb-5 flex items-center gap-3 text-[10px] font-semibold tracking-[0.25em] text-[#b0845a] uppercase"><Sparkles className="size-4" /> Coleção 2025</div><h1 className="max-w-xl font-serif text-5xl leading-[0.98] text-[#49362d] sm:text-7xl">Detalhes que<br /><em className="font-normal text-[#b0845a]">contam histórias.</em></h1><p className="mt-7 max-w-md text-sm leading-7 text-[#817168]">Semijoias pensadas para acompanhar seus momentos mais especiais — com delicadeza, personalidade e brilho na medida certa.</p><a href="#colecao" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#6e4e3e] px-6 py-3.5 text-xs font-semibold tracking-[0.12em] text-white uppercase transition-transform hover:scale-105">Explorar coleção <ArrowRight className="size-4" /></a><div className="mt-12 flex gap-8 border-t border-[#e2d8ce] pt-5"><div><p className="font-serif text-xl text-[#6e4e3e]">+12k</p><p className="mt-1 text-[9px] tracking-[0.14em] text-[#a18e80] uppercase">Clientes encantadas</p></div><div><p className="font-serif text-xl text-[#6e4e3e]">4.9/5</p><p className="mt-1 flex items-center gap-1 text-[9px] tracking-[0.14em] text-[#a18e80] uppercase"><Star className="size-3 fill-[#bd966e] text-[#bd966e]" /> Avaliação média</p></div></div></div>
        <div className="order-1 relative mx-auto w-full max-w-[540px] lg:order-2"><div className="aspect-[0.88] overflow-hidden rounded-[180px_180px_16px_16px] bg-[#eee5da]"><img src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=90" alt="Colar dourado da coleção Le Semijoias" className="size-full object-cover object-center" /></div><div className="absolute -bottom-4 -left-4 flex size-24 items-center justify-center rounded-full bg-[#c69f77] text-center text-[9px] leading-4 tracking-[0.1em] text-white uppercase shadow-lg sm:-left-8 sm:size-32"><span>Feito para<br />brilhar<br /><em className="font-serif text-sm normal-case">com você</em></span></div></div>
      </section>

      <section id="colecao" className="border-t border-[#e7dfd6] bg-white px-5 py-14 lg:px-10 lg:py-20"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-[#b0845a] uppercase">Seleção Le Semijoias</p><h2 className="font-serif text-4xl text-[#49362d]">Encontre seu brilho</h2></div><p className="max-w-xs text-right text-xs leading-5 text-[#938278]">Peças versáteis para expressar quem você é, todos os dias.</p></div><div className="mt-9 flex items-center gap-2 overflow-x-auto pb-2">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] tracking-[0.12em] uppercase transition-colors ${activeCategory === category ? 'border-[#6e4e3e] bg-[#6e4e3e] text-white' : 'border-[#dfd5cb] text-[#826f63] hover:border-[#a88a71]'}`}>{category}</button>)}<button onClick={() => setFilterOpen(!filterOpen)} className="ml-auto flex shrink-0 items-center gap-2 rounded-full border border-[#dfd5cb] px-4 py-2 text-[10px] tracking-[0.12em] text-[#826f63] uppercase"><SlidersHorizontal className="size-3.5" /> Filtros</button></div>{filterOpen && <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl bg-[#f8f4ef] p-4 text-xs text-[#7d6c61]"><Filter className="size-4 text-[#b0845a]" /><span className="font-medium">Faixa de preço:</span>{['Todas', 'Até R$ 150', 'Acima de R$ 150'].map((option) => <button key={option} onClick={() => setPriceFilter(option)} className={`rounded-full border px-3 py-1.5 text-[10px] uppercase transition-colors ${priceFilter === option ? 'border-[#6e4e3e] bg-[#6e4e3e] text-white' : 'border-[#d9cbbf] text-[#826f63]'}`}>{option}</button>)}<button onClick={clearFilters} className="ml-auto text-[10px] font-semibold tracking-[0.1em] text-[#6e4e3e] uppercase">Limpar filtros</button><button onClick={() => setFilterOpen(false)} className="flex size-7 items-center justify-center" aria-label="Fechar filtros"><X className="size-4" /></button></div>}
        <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <article key={product.id} className="group"><div className="relative aspect-[0.86] overflow-hidden rounded-xl bg-[#f1ebe4]"><img src={product.image} alt={product.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />{product.badge && <span className="absolute left-3 top-3 rounded-full bg-[#fbfaf7]/90 px-2.5 py-1 text-[8px] font-semibold tracking-[0.1em] text-[#765541] uppercase">{product.badge}</span>}<button onClick={() => toggleFavorite(product.id)} aria-label={favorites.includes(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-[#fbfaf7]/90 text-[#795f4e]"> <Heart className={`size-4 ${favorites.includes(product.id) ? 'fill-[#b0845a] text-[#b0845a]' : ''}`} /></button><button onClick={() => setSelected(product)} className="absolute bottom-3 left-3 right-3 translate-y-2 rounded-full bg-white/95 py-2.5 text-[9px] font-semibold tracking-[0.14em] text-[#6e4e3e] uppercase opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">Ver detalhes</button></div><div className="mt-3 flex items-start justify-between gap-2"><div><p className="text-[9px] tracking-[0.1em] text-[#b0845a] uppercase">{product.category} · {product.code}</p><h3 className="mt-1 font-serif text-lg text-[#4c3930]">{product.name}</h3></div><p className="pt-4 text-xs font-medium text-[#6e4e3e]">{money(product.price)}</p></div></article>)}</div>{visibleProducts.length === 0 && <div className="rounded-2xl bg-[#f8f4ef] px-6 py-14 text-center"><p className="font-serif text-2xl text-[#49362d]">Nenhuma peça encontrada</p><p className="mt-2 text-sm text-[#938278]">Tente outra busca ou limpe os filtros para continuar explorando.</p><button onClick={clearFilters} className="mt-5 rounded-full bg-[#6e4e3e] px-5 py-2.5 text-[10px] font-semibold tracking-[0.12em] text-white uppercase">Limpar busca</button></div>}</div></section>
      <section id="sobre" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-2 lg:items-center lg:px-10"><div className="overflow-hidden rounded-2xl bg-[#e8ded3]"><img src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1000&q=85" alt="Detalhe de uma mão usando anéis delicados" className="aspect-[1.15] size-full object-cover" /></div><div className="lg:px-12"><p className="mb-3 text-[10px] tracking-[0.22em] text-[#b0845a] uppercase">A essência Le Semijoias</p><h2 className="font-serif text-4xl leading-tight text-[#49362d]">Menos excesso.<br /><em className="font-normal text-[#b0845a]">Mais significado.</em></h2><p className="mt-6 text-sm leading-7 text-[#817168]">Acreditamos que uma joia não precisa esperar uma ocasião especial. Ela pode ser o detalhe que transforma uma terça-feira comum em um momento só seu.</p><p className="mt-5 text-sm leading-7 text-[#817168]">Cada peça é escolhida com olhar atento para acompanhar sua história por muito tempo.</p><a href="#contato" className="mt-7 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.12em] text-[#6e4e3e] uppercase">Conheça a Le Semijoias <ArrowRight className="size-4" /></a></div></section>
      <footer id="contato" className="bg-[#302521] px-5 py-12 text-[#e9d8c1] lg:px-10"><div className="mx-auto flex max-w-7xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-serif text-3xl tracking-[0.14em]">LE SEMIJOIAS.</p><p className="mt-3 max-w-xs text-xs leading-5 text-[#bca99a]">Semijoias para iluminar o cotidiano e celebrar quem você é.</p></div><div className="flex gap-5"><a href="#colecao" className="text-xs text-[#d1bda9]">Coleção</a><a href="#sobre" className="text-xs text-[#d1bda9]">Sobre nós</a><a href="/admin" className="text-xs text-[#d1bda9]">Admin</a><a href="https://instagram.com" aria-label="Instagram" className="text-xs font-semibold tracking-[0.1em] text-[#d1bda9]">IG</a></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-[#5b4740] pt-5 text-[10px] tracking-[0.12em] text-[#9d897b] uppercase">© 2025 Le Semijoias Semijoias · Feito com intenção</div></footer>

      {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#302521]/40 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true"><div className="relative grid max-h-[92vh] w-full max-w-3xl overflow-auto rounded-t-2xl bg-[#fbfaf7] sm:grid-cols-2 sm:rounded-2xl"><button onClick={() => setSelected(null)} className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#6e4e3e]" aria-label="Fechar"><X className="size-4" /></button><img src={selected.image} alt={selected.name} className="aspect-square size-full object-cover" /><div className="flex flex-col justify-center p-7 sm:p-10"><p className="text-[10px] tracking-[0.18em] text-[#b0845a] uppercase">{selected.category} · {selected.code}</p><h2 className="mt-3 font-serif text-3xl text-[#49362d]">{selected.name}</h2><p className="mt-4 font-serif text-2xl text-[#6e4e3e]">{money(selected.price)}</p><p className="mt-5 text-sm leading-6 text-[#817168]">Uma peça delicada e atemporal, pensada para acompanhar você em todos os momentos. Banhada a ouro 18k, com acabamento hipoalergênico.</p><div className="mt-7 flex flex-col gap-3"><button onClick={() => whatsapp(selected)} className="flex items-center justify-center gap-2 rounded-full bg-[#6e4e3e] py-3.5 text-xs font-semibold tracking-[0.12em] text-white uppercase"><MessageCircle className="size-4" /> Tenho interesse</button><button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="flex items-center justify-center gap-2 rounded-full border border-[#d8cbbf] py-3.5 text-xs font-semibold tracking-[0.12em] text-[#6e4e3e] uppercase"><Share2 className="size-4" /> Compartilhar peça</button></div><p className="mt-5 flex items-center gap-2 text-[10px] text-[#9a887b]"><Check className="size-3 text-[#b0845a]" /> Disponível para você</p></div></div></div>}
    </main>
  )
}
