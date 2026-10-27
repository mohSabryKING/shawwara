import { getDict, isLocale, Locale } from "@/lib/i18n";
import { services, visitTypes, doctors, jobs } from "@/lib/catalog";
import { latestPosts } from "@/lib/posts";
import { HeroCanvas, Pillars, ServicesTable, ContactPanel } from "@/components/HomeClient";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: lc } = await params;
  if (!isLocale(lc)) notFound();
  const locale = lc as Locale;
  const t = getDict(locale);
  const ar = locale === "ar";
  const l = (p: string) => `/${locale}${p}`;
  const posts = latestPosts(3);
  const dateFmt = (d: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(ar ? "ar-EG" : "en-GB", o).format(new Date(d));
  const keywords = ar ? ["زراعة", "تقويم", "ليزر", "تبييض", "أطفال", "أشعة رقمية"] : ["Implants", "Orthodontics", "Laser", "Whitening", "Paediatric", "Digital X-ray"];

  return (
    <>
      {/* 2 — Hero */}
      <section className="hero">
        <HeroCanvas />
        <div className="container hero-grid">
          <div>
            <span className="eyebrow fade-in" style={{ color: "var(--brand-accent)" }}>{t.hero.eyebrow}</span>
            <h1>
              {t.hero.title.map((line, i) => (
                <span className="line-mask" key={i}><span className={i === 2 ? "accent" : ""}>{line}</span></span>
              ))}
            </h1>
            <p className="fade-in">{t.hero.sub}</p>
            <div className="hero-ctas fade-in">
              <a href={l("/book")} className="btn btn-primary magnetic">{t.hero.cta} <span className="arrow">→</span></a>
              <a href={l("#services")} className="btn btn-ghost">{t.hero.secondary}</a>
            </div>
          </div>
          <div className="hero-visual fade-in" style={{ width: "100%", height: "400px", display: "grid", placeContent: "center" }} >
            <img src="/generated/Shaw-1.png" alt="" style={{ width: "100%", height: "auto" }} fetchPriority="high" />
          </div>
        </div>
        <span className="scroll-hint">Scroll</span>
      </section>

      {/* 3 — Statement + KPIs */}
      <section className="section">
        <div className="container">
          <p className="statement">
            {t.intro.statement.split(" ").map((w, i) => <span className="w" key={i}>{w} </span>)}
          </p>
          <div className="kpis">
            {t.intro.stats.map((s, i) => (
              <div className="kpi reveal" key={i}>
                <b data-count={s.value || undefined}>{s.value ? 0 : "—"}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — What we do (pinned) */}
      <section className="what" id="what">
        <div className="blob a" data-parallax="-30" /><div className="blob b" data-parallax="25" />
        <div className="container what-stage">
          <div className="what-object"><img src="/generated/implant.webp" alt="" loading="lazy" /></div>
          <div>
            <span className="eyebrow">{t.what.eyebrow}</span>
            <div className="what-copy">
              {t.what.items.map((it, i) => (
                <div className="what-item" key={i}><h3>{it.title}</h3><p>{it.text}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Pillars */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{t.pillars.eyebrow}</span>
          <h2 className="h2 reveal">{t.pillars.title}</h2>
          <Pillars items={t.pillars.items} imgs={["/generated/team-hands.webp", "/generated/xray.webp", "/generated/lounge-interior.webp", "/generated/pediatric.webp"]} />
        </div>
      </section>

      {/* 6 — Journey */}
      <section className="section journey">
        <div className="container journey-grid">
          <div className="journey-title">
            <span className="eyebrow" style={{ color: "var(--brand-accent)" }}>{t.journey.eyebrow}</span>
            <h2 className="h2">{t.journey.title}</h2>
          </div>
          <div className="steps">
            <div className="track" /><div className="fill" />
            {t.journey.steps.map((s, i) => (
              <div className="step" key={i}>
                <div className="num">0{i + 1}</div><h3>{s.title}</h3>
                <ul>{s.subs.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Services table */}
      <section className="section" id="services">
        <div className="container">
          <span className="eyebrow">{t.servicesSec.eyebrow}</span>
          <h2 className="h2 reveal">{t.servicesSec.title}</h2>
          <ServicesTable
            cols={t.servicesSec.col} book={t.servicesSec.book} min={t.booking.minutes}
            rows={services.map((s) => ({
              name: ar ? s.ar : s.en, spec: ar ? s.specAr : s.specEn, img: s.img,
              minutes: visitTypes.find((v) => v.slug === s.visit)!.minutes, href: l(`/book?visit=${s.visit}`),
            }))}
          />
        </div>
      </section>

      {/* 8 — Keyword marquee */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...keywords, ...keywords].map((k, i) => <span key={i}>{k} ·</span>)}
        </div>
      </div>

      {/* 9 — Team */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{t.team.eyebrow}</span>
          <h2 className="h2 reveal">{t.team.title}</h2>
          <div className="team-track">
            {doctors.map((d) => (
              <article className="doc" key={d.id}>
                <div className="ph clip-reveal"><img src={d.img} alt={ar ? d.ar : d.en} loading="lazy" /></div>
                <h3>{ar ? d.ar : d.en}</h3>
                <p className="muted">{ar ? d.roleAr : d.roleEn}</p>
                {d.demo && <span className="badge">{t.team.demo}</span>}<br />
                <a className="btn btn-ghost" href={l(`/book?doctor=${d.id}`)}>{t.team.bookWith} {(ar ? d.ar : d.en).split(" ").slice(0, 2).join(" ")}</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Insights */}
      <section className="section" id="insights" style={{ background: "var(--surface)" }}>
        <div className="container">
          <span className="eyebrow">{t.insights.eyebrow}</span>
          <h2 className="h2 reveal">{t.insights.title}</h2>
          <div className="cards3">
            {posts.map((p) => (
              <a className="post reveal" key={p.id} href={p.url} target="_blank" rel="noopener" dir="rtl">
                <div className="ph">
                  <img src={p.cover} alt={p.title} loading="lazy" />
                  <div className="date">{dateFmt(p.date, { day: "2-digit" })}<small>{dateFmt(p.date, { month: "short", year: "numeric" })}</small></div>
                </div>
                <h3>{p.title}</h3>
                <p className="muted" style={{ fontSize: ".92rem" }}>{t.insights.read} ←</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 11 — Careers band */}
      <section className="section">
        <div className="container">
          <div className="careers-band">
            <div className="clip-reveal"><img src="/generated/team-hands.webp" alt="" loading="lazy" /></div>
            <div className="copy">
              <span className="count-pill">{jobs.length} {t.careersBand.open}</span>
              <span className="eyebrow" style={{ color: "var(--brand-accent)" }}>{t.careersBand.eyebrow}</span>
              <h2 className="h2" style={{ marginTop: 0 }}>{t.careersBand.title}</h2>
              <p style={{ opacity: .8 }}>{t.careersBand.text}</p>
              <a className="btn btn-primary" style={{ alignSelf: "flex-start" }} href={l("/careers")}>{t.careersBand.cta} <span className="arrow">→</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* 12 — Closing CTA */}
      <section className="section closing" id="contact">
        <div className="container">
          <h2 className="reveal">{t.closing.title}</h2>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={l("/book")} className="btn btn-primary magnetic">{t.nav.book} <span className="arrow">→</span></a>
            <ContactPanel t={t.closing} />
          </div>
        </div>
      </section>
    </>
  );
}
