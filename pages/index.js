import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const TONES = ['丁寧でわかりやすい', 'やわらかく親しみやすい', '落ち着いた専門的', 'フランクで読みやすい']
const LENGTHS = [
  { label: '400字', value: '400' },
  { label: '600字', value: '600' },
  { label: '800字', value: '800' },
  { label: '1000字', value: '1000' },
  { label: '1200字', value: '1200' },
]
const PURPOSES = ['認知・理解促進', '行動を後押し', '不安の解消', '情報整理']
const READER_LEVELS = ['初心者・一般読者', '中級者', '専門家・上級者']
const RISK_LEVELS = ['低め（慎重に）', '標準', 'やや高め']

export default function Home() {
  const [form, setForm] = useState({
    topic: '',
    tone: TONES[0],
    length: '800',
    purpose: PURPOSES[0],
    reader_level: READER_LEVELS[0],
    risk_level: RISK_LEVELS[1],
    industry: '',
    company_size: '',
    area: '',
    position: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const generate = async () => {
    if (!form.topic.trim()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'エラーが発生しました')
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copy = () => {
    if (!result?.text) return
    navigator.clipboard.writeText(result.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>コラム生成 AI</title>
        <meta name="description" content="商用利用前提のコラム文章を生成します" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>文</span>
            <div>
              <div className={styles.logoTitle}>コラム生成 AI</div>
              <div className={styles.logoSub}>Column Generator</div>
            </div>
          </div>
          <nav className={styles.nav}>
            <span className={`${styles.navItem} ${styles.navActive}`}>生成</span>
          </nav>
          <div className={styles.sideNotice}>
            本ツールは情報整理を目的としています。最終的な内容の判断は利用者が行ってください。
          </div>
        </aside>

        <main className={styles.main}>
          <div className={styles.container}>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>01</span>
                <h2 className={styles.sectionTitle}>テーマ</h2>
              </div>
              <textarea
                className={styles.textarea}
                placeholder="例：フリーランスのインボイス対応について考える"
                value={form.topic}
                onChange={e => set('topic', e.target.value)}
                rows={3}
              />
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>02</span>
                <h2 className={styles.sectionTitle}>文章条件</h2>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>トーン</label>
                <div className={styles.pillGroup}>
                  {TONES.map(t => (
                    <button
                      key={t}
                      className={`${styles.pill}${form.tone === t ? ' ' + styles.pillActive : ''}`}
                      onClick={() => set('tone', t)}
                    >{t}</button>
                  ))}
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>文字数</label>
                <div className={styles.pillGroup}>
                  {LENGTHS.map(l => (
                    <button
                      key={l.value}
                      className={`${styles.pill}${form.length === l.value ? ' ' + styles.pillActive : ''}`}
                      onClick={() => set('length', l.value)}
                    >{l.label}</button>
                  ))}
                </div>
              </div>

              <div className={styles.grid3}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>狙い</label>
                  <select className={styles.select} value={form.purpose} onChange={e => set('purpose', e.target.value)}>
                    {PURPOSES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>読者レベル</label>
                  <select className={styles.select} value={form.reader_level} onChange={e => set('reader_level', e.target.value)}>
                    {READER_LEVELS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>リスク許容度</label>
                  <select className={styles.select} value={form.risk_level} onChange={e => set('risk_level', e.target.value)}>
                    {RISK_LEVELS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>03</span>
                <h2 className={styles.sectionTitle}>
                  クライアント情報
                  <span className={styles.optional}>任意</span>
                </h2>
              </div>
              <div className={styles.grid2}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>業種・業界</label>
                  <input className={styles.input} placeholder="例：税理士事務所" value={form.industry} onChange={e => set('industry', e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>規模感</label>
                  <input className={styles.input} placeholder="例：中小企業" value={form.company_size} onChange={e => set('company_size', e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>地域</label>
                  <input className={styles.input} placeholder="例：東京都" value={form.area} onChange={e => set('area', e.target.value)} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>立場</label>
                  <input className={styles.input} placeholder="例：経営者向け" value={form.position} onChange={e => set('position', e.target.value)} />
                </div>
              </div>
            </section>

            <button
              className={styles.generateBtn}
              onClick={generate}
              disabled={loading || !form.topic.trim()}
            >
              {loading ? (
                <span className={styles.loadingWrap}>
                  <span className={styles.loadingDot} />
                  <span className={styles.loadingDot} style={{ animationDelay: '0.15s' }} />
                  <span className={styles.loadingDot} style={{ animationDelay: '0.3s' }} />
                  <span style={{ marginLeft: 12 }}>生成しています...</span>
                </span>
              ) : 'コラムを生成する'}
            </button>

            {error && <div className={styles.errorBox}>{error}</div>}

            {result && (
              <section className={styles.resultSection}>
                <div className={styles.resultHeader}>
                  <h3 className={styles.resultTitle}>生成結果</h3>
                  <div className={styles.resultMeta}>
                    <span className={styles.charCount}>{result.text.length}文字</span>
                    <button className={styles.copyBtn} onClick={copy}>
                      {copied ? '✓ コピーしました' : 'コピー'}
                    </button>
                  </div>
                </div>
                {result.ngHits?.length > 0 && (
                  <div className={styles.warnBox}>
                    NG表現が含まれている可能性があります：{result.ngHits.join('、')}
                  </div>
                )}
                <div className={styles.resultBody}>{result.text}</div>
              </section>
            )}

          </div>
        </main>
      </div>
    </>
  )
}
