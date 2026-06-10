type Props = {
  title: string
  subtitle?: string
  imageUrl: string
}

export default function PortalPageBanner({ title, subtitle, imageUrl }: Props) {
  return (
    <div className="-mx-8 -mt-24 relative overflow-hidden mb-10" style={{ height: '240px' }}>
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#133425]/80 via-[#133425]/50 to-[#f5f0e4]" />
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center px-8 pb-10">
        {subtitle && (
          <p className="text-[#F5F0E4]/60 text-xs tracking-[0.3em] uppercase mb-2">{subtitle}</p>
        )}
        <h1 className="font-bold text-3xl sm:text-4xl uppercase tracking-widest text-[#F5F0E4] drop-shadow-lg">
          {title}
        </h1>
      </div>
    </div>
  )
}
