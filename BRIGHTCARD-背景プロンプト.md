# BrightCard 背景生成プロンプト・正本（世界ソース精査版）

- 目的: 各デザインパターンの「AI生成背景」を量産するための、ツール非依存のプロンプト集。
- 合成モデル: **フレーム内配置**（生成背景の上に枠付きで顔写真を載せる／切り抜き不要）。
- 運用: **パターン別に5〜8枚ずつ事前生成してライブラリ化**し、会員に合う1枚を選ぶ（B方式）。上位オプションで「都度生成の専用背景」（C方式）。
- 出典: Sonnet20体が世界のプロンプト集（Midjourney/SDXL/Flux/PromptHero/Lexica/Civitai/Reddit/日本語ソース）から121本収集 → Opusが精査・統合し15本＋辞書に凝縮（2026-07-14）。
- 決定: フレーム内配置／ライブラリ選択＋都度生成オプション（2026-07-13 清田さん承認）。

---

## 0. この設計の肝（精査で分かった要点）

- **保護すべき「静けさの帯」は2つ**: ①中央＝顔写真フレームが乗る ②下1/3＝氏名テキストが乗る。全プロンプトがこの2ゾーンを低情報に保つよう指示済み。
- **accentは1トークンだけ差し替え**: `{ACCENT_NAME}`（英語色名）＋`{ACCENT_HEX}`。**光・グロー・罫線にだけ**当て、下地の色には当てない。1色替えるだけで会員ごとに着せ替わる。
  - 例: 清田さん `#EA580C` → `{ACCENT_NAME}=burnt orange` / `{ACCENT_HEX}=#EA580C`。
- **各パターンに3方言**: Midjourney＋SDXL/Flux＋自然文ツール（DALL·E/Ideogram/Imagen）。清田さんが使いやすいツールを選べる。
- **一番の落とし穴（後述§8）**: Flux/DALL·E/nano-bananaはネガティブ欄を無視する→除外は本文に書く。Ideogramは MagicPrompt を必ずOFF。和紙・紙系は放っておくと漢字を捏造する→明示的に禁止。

## 共通仕様（全パターン）

- **縦横比**: 9:16（スマホ縦）。ツール別トークンは §7。
- **被写体を入れない**: 人物・顔・文字・ロゴ・時計・watermark は禁止（顔写真とテキストはこちらで重ねる）。
- **共通ネガティブ辞書**は §6。paste時はここから必要分をコピー。
- **保存先**: `members/_assets/backgrounds/<pattern>/NN.jpg`（公開時 `/card/_assets/backgrounds/<pattern>/NN.jpg`）。都度生成の専用背景は会員フォルダに `bg.jpg` を置き card.js で上書き。
- **QA必須**: ネガティブは確率的。1バッチ2〜3枚出して、人影・擬似文字・2つ目のブロブ・中央/下部への情報漏れがあるものは捨てる。

---

## 1. Bright（暗・シネマ／角丸縦フレーム下寄せ）

- **accent**: リム/グローに **上1/3限定・中〜高強度**。near-black相手なら鮮やかでも映える。中央と下は絶対に明るくしない。
- **可読性**: 中央=無光の静か（顔写真）／下1/3=ディテールなしのnear-blackへ。中央・下中央のホットスポット禁止。「volumetric haze」と「lens flare」を区別（フレアの輪がロゴに誤読されるのを防ぐ）。

**Midjourney**
```
dark cinematic vertical background plate, deep charcoal to near-black gradient, dramatic volumetric light rays descending diagonally from the top edge through fine atmospheric haze, soft {ACCENT_NAME} ({ACCENT_HEX}) rim glow pooling only in the upper third, faint dust motes catching the beam, the entire lower two-thirds fades smoothly to solid near-black with no detail, calm unlit center reserved for a portrait, empty flat black bottom strip for name text, moody chiaroscuro, subtle film grain, no subject, no text
--no people, person, face, human, figure, silhouette, hands, text, letters, typography, logo, watermark, signature, lens flare rings, bright center hotspot, busy pattern, clutter
--ar 9:16 --style raw --v 6.1 --stylize 200 --chaos 4
```
> MJの `--no` が信頼できる除外チャンネル。stylizeは中程度で暗い静寂ゾーンを装飾させない。会員ごとにaccent2トークンだけ替える。

**SDXL**（Juggernaut XL / RealVisXL）
```
(dark cinematic empty background plate:1.3), deep charcoal to near-black vertical gradient, (volumetric light rays:1.2) descending from top edge, thin atmospheric haze, floating dust motes, (soft rim glow {ACCENT_HEX}:1.2) confined to upper third, calm unlit center, lower two-thirds fading to pure near-black #050505, matte, chiaroscuro studio lighting, subtle film grain, background plate for compositing, no subject
NEG: people, person, human, face, portrait, figure, silhouette, hands, body, text, letters, words, typography, watermark, signature, logo, icon, lens flare, glare rings, bright center hotspot, busy detail, clutter, noise, jpeg artifacts, lowres, blurry, border, frame
832x1472 (9:16), steps 32, CFG 6, sampler DPM++ 2M Karras, hires fix 1.5x denoise 0.35
```
> "background plate for compositing"＋重み付き"empty"が暗所の人影捏造を実測で減らす。会員セットはseed固定で `{ACCENT_HEX}` 節だけ替える。

**DALL·E 3 / Imagen 3**（自然文・ネガ欄なし）
```
A vertical 9:16 dark cinematic background plate for a phone screen, completely empty of any subject. Deep charcoal fading to near-black, with a single dramatic shaft of volumetric light descending through thin haze from the top edge. A soft glow tinted {ACCENT_NAME} ({ACCENT_HEX}) pools only in the upper third and dissolves into the darkness. The center stays calm and low in detail, and the entire bottom third is almost flat near-black. Moody cinematic color grading, gentle film grain. This image must contain no people, no faces, no hands, no text, no letters, no logos, and no watermark — only gradient, light, and haze.
DALL·E 3: 1024x1792, quality hd, style natural（下を crop-check、実質4:7）。Imagen 3: aspectRatio '9:16', personGeneration 'dont_allow'
```
> 除外は末尾の "must contain no…" 一文で。`card / sign / label / frame` の語は文字を呼ぶので避ける。

---

## 2. Aura（柔光ボケ／円アバター中央）

- **accent**: 淡い低彩度のティント（〜20-30%）を上の隅から。純色ではなく「pale wash」。赤や紺でも淡いパステルに馴染むよう `pale`/`soft glow` の語は固定。
- **可読性**: 全面ローコントラスト・ハイキー。大きなボケ玉は上と横の縁だけに寄せ、中央（顔写真）と下1/3（氏名）を静かに。コントラスト上限を明示（パステルがネオンに転ぶと可読性崩壊）。

**Midjourney**
```
soft dreamy pastel bokeh background plate, airy cream, powder-blue and blush gradient, luminous diffused light, large out-of-focus bokeh orbs drifting near the top and side edges only, extremely calm low-contrast empty center for a portrait, gentle {ACCENT_NAME} ({ACCENT_HEX}) tint diffusing softly from one upper corner as a pale wash, smooth clean lower third for name text, ethereal high-key mood, no subject, no text
--no people, person, face, human, figure, hands, text, letters, typography, logo, watermark, high contrast, hard shadows, dark tones, saturated neon, busy bokeh in center, noise
--ar 9:16 --style raw --v 6.1 --stylize 120
```
> 低stylizeでボケが騒がしいアートになるのを防ぐ。縁だけ配置が中央を本当に静かにする鍵。

**SDXL**（DreamShaper XL / Juggernaut XL）
```
(soft dreamy pastel bokeh background:1.3), cream powder-blue blush gradient, airy luminous atmosphere, (large out-of-focus bokeh orbs:1.1) drifting near edges only, (calm low-contrast empty center:1.3), pale {ACCENT_HEX} tint wash from one upper corner, smooth clean lower third, high-key soft studio light, matte, background plate for compositing, no subject
NEG: people, person, human, face, hands, body, text, letters, watermark, logo, signature, harsh shadows, high contrast, dark background, black, oversaturated, neon, busy pattern in center, noise, grain, jpeg artifacts, border, frame
832x1472, steps 30, CFG 5.5, sampler DPM++ 2M Karras, hires fix 1.5x
```
> CFGは低め(5.5)。高CFGはボケ密度を上げて顔写真と競合する。hiresで中央を滑らかに。

**Flux**（.1 dev/pro）
```
A soft, dreamy vertical 9:16 background plate with airy pastel bokeh — creamy off-white, powder blue, and gentle blush pink blending smoothly. Large, softly blurred circles of light drift near the top and side edges, while the center stays calm, low-contrast, and almost empty, like negative space reserved for a portrait. A faint {ACCENT_NAME} ({ACCENT_HEX}) glow radiates gently from one upper corner, dissolving into the pastel base. The lower third stays smooth and even for name text. Soft matte finish, gentle film grain, natural diffused light. No people, no faces, no text, no logos — purely an atmospheric backdrop.
aspect 9:16 (896x1600), guidance 3.0, steps 28
```
> Fluxは "reserved for a portrait" / "for name text" の空間指示をよく守る。dev のネガ欄は無効なので除外は本文に。

---

## 3. Editorial（雑誌／左フレーム右明朝・金の細線）

- **accent**: **金の細罫の淡いアンダートーンだけ**（塗り面やグロー禁止）。足跡は10-15%上限。「pale gold with a faint {ACCENT_NAME} undertone」で誘導。
- **可読性**: 2つの静寂ゾーン＝クリーム無地の中央（顔写真）＋下1/3クリーン（氏名）。金の線は1つの隅/縁だけ。線は "foil-stamped / etched, not drawn"（太い装飾金にしない）。パレットは cream/ivory/gold に固定（グレー青の"minimal"へ流れるのを防ぐ）。

**Midjourney**
```
warm off-white magazine paper background plate, cream ivory tone, generous negative space, very subtle thin gold geometric hairlines forming a small open rectangle in the top-right corner only, faint {ACCENT_NAME} ({ACCENT_HEX}) undertone in the gold linework, fine paper grain, soft even studio light, calm flat cream center for a portrait, clean empty lower third for name text, quiet-luxury editorial minimalism, foil-stamped restraint, no subject, no text
--no people, person, face, human, hands, text, letters, typography, words, logo, watermark, heavy gold, thick lines, busy pattern, clutter, dark background, high saturation, 3d render
--ar 9:16 --style raw --v 6.1 --stylize 60
```
> 超低stylizeが要。MJの既定は余白を物で埋める＝editorialの本質(余白)を壊すため。

**Flux**（.1 dev/pro）— 3方言中もっとも2ゾーン分割を守る
```
A vertical 9:16 editorial magazine background plate in soft natural daylight. The surface is warm off-white textured paper with faint grain, like a premium print magazine's inside cover. The composition is mostly empty negative space. In the top-right corner, one very thin gold line forms a simple open rectangle, so fine it looks foil-stamped rather than drawn, carrying a faint {ACCENT_NAME} ({ACCENT_HEX}) undertone. The center stays calm and unmarked for a framed photo, and the lower third stays smooth and even for name text. Soft diffused slightly-warm light, no harsh shadows, no vignette. Palette is strictly cream, ivory, warm white and pale gold — no cool tones, no gray. No text, no letters, no numbers, no logos, no watermark, no people, no faces, no hands.
aspect 9:16 (896x1600), guidance 3.2, steps 30
```
> "no cool tones, no gray" のパレット固定がFluxの冷たいminimal化を打ち消す。

**SDXL**（Juggernaut XL / RealVisXL＋任意 Paper Texture LoRA 0.6）
```
(warm off-white magazine paper background:1.3), cream ivory, fine paper grain, (generous negative space:1.2), (thin gold geometric hairline:1.1) forming a small open rectangle top-right corner only, faint {ACCENT_HEX} undertone in the gold line, calm flat center, clean empty lower third, soft even studio light, matte, quiet-luxury editorial, foil-stamped restraint, background plate for compositing, no subject
NEG: people, person, face, human, hands, text, letters, typography, watermark, logo, signature, thick bold lines, saturated fills, busy pattern, clutter, dark background, high contrast, 3d render, cartoon, noise, border, cool gray tones
832x1472, steps 30, CFG 5, sampler DPM++ 2M Karras
```

---

## 4. Washi（和紙／額装フレーム・墨＋金箔）

- **accent**: 「墨の滲みに顔料を溶かすように（diluted into the sumi ink wash）」の物質メタファーで誘導。どんなhexも有機的な紙に対して自然に沈む。faint(10-15%)・中心を外す。kinari下地・金箔は染めない。
- **可読性**: 手つかずのkinari中央（顔写真）＋下1/3滑らか（氏名）。墨の滲み・金箔は上縁/上隅に限定。**柔らかい環境光のみ**（指向性の影・volumetric beam 禁止＝シネマにしない）。**漢字・書・落款は明示的に禁止**（墨＋紙は放置で字を捏造する）。

**Midjourney**
```
vertical 9:16 background plate, authentic Japanese washi paper texture, undyed kinari cream base, visible fine kozo fiber grain, one faint sumi ink wash bleeding softly from the upper-left corner, delicate gold leaf kinpaku flecks scattered only along the top edge, calm untouched cream center for a portrait, smooth clean lower third for name text, extremely subtle {ACCENT_NAME} ({ACCENT_HEX}) tint diluted into the ink wash like pigment mixed with sumi, wabi-sabi serenity, soft diffuse ambient light, no directional shadow, matte fine-art paper, macro paper photography, no subject, no text
--no people, person, face, human, hands, text, letters, kanji, kana, calligraphy, hanko, seal, stamp, logo, watermark, signature, busy pattern, high contrast, volumetric ray, glossy, plastic, 3d render
--ar 9:16 --style raw --v 6.1 --stylize 120
```
> "macro paper photography"＋`--style raw` で絵画でなく写真的テクスチャに寄せる。

**SDXL**（RealVisXL＋Sumi-e LoRA~0.4＋Gold-Leaf LoRA~0.3）
```
(japanese washi paper texture:1.3), (kinari cream:1.2), visible kozo fiber grain, (sumi ink wash:1.15) bleeding softly from upper-left corner only, (gold leaf kinpaku flecks:1.2) scattered along top edge, calm untouched center, smooth clean lower third, extremely subtle {ACCENT_HEX} tint diluted into the ink wash, wabi-sabi, soft ambient diffuse light, no directional shadow, matte, macro paper texture, background plate for compositing, no subject
NEG: people, person, face, human, hands, text, kanji, hiragana, kana, calligraphy, characters, hanko, seal, stamp, logo, watermark, signature, busy pattern, oversaturated, neon, glossy, plastic, 3d render, cartoon, noise, high contrast, volumetric beam, border
832x1472, steps 32, CFG 6, sampler DPM++ 2M Karras, hires fix 1.5x
```
> 2つの狭いテクスチャLoRAを低weightで混ぜる（どちらも絵にしない）＝本物の質感。

**Ideogram**（MagicPrompt必ずOFF）
```
A serene vertical 9:16 background plate resembling fine Japanese washi paper: warm undyed kinari cream with soft fibrous texture. A single faint sumi ink wash drifts softly from the upper-left corner, and a few delicate gold leaf (kinpaku) flecks glint only along the top edge. The center stays calm and nearly texture-free for a framed photo, and the lower third stays smooth for name text. An extremely subtle {ACCENT_NAME} ({ACCENT_HEX}) tint blends into the ink wash. Muted wabi-sabi palette, soft even museum lighting, matte finish. This image must contain no people, no faces, no hands, no text, no kanji, no calligraphy, no stamps or seals, no logos, and no watermark.
aspect_ratio ASPECT_9_16, magic_prompt_option OFF, style_type REALISTIC, rendering QUALITY
```
> MagicPrompt OFF が必須（ONだと和紙に装飾漢字を注入し no-text 違反）。

---

## 5. Minimal（白・余白／小円）

- **accent**: 1つの隅の柔らかいグラデ・ブロブに低彩度・強フェザー。会員セットでは隅を回す（右上→左上→左下）と変化が出る。15-20%上限、`soft/feathered/low saturation` 固定。
- **可読性**: 広大な余白＝中央（顔写真）と下1/3（氏名）は空。**2つ目の競合ブロブ/光源を禁止**。near-white平面のOLEDバンディング防止に~5%グレイン。"frame"（額縁オブジェクトを生む）でなく "calm untouched zone" と書く。

**Midjourney**
```
near-white off-white minimalist background plate, vast clean negative space, one very soft {ACCENT_NAME} ({ACCENT_HEX}) tinted gradient blob glowing gently in the top-right corner only, heavily feathered edges dissolving into the white, matte finish, barely-there fine grain to avoid banding, calm empty center for a portrait, clean flat lower third for name text, modern IT-brand aesthetic, high-key flat light, no subject, no text
--no people, person, face, human, hands, text, letters, typography, logo, watermark, multiple blobs, busy pattern, saturated color, dark background, high contrast, hard edges, noise, border, frame
--ar 9:16 --style raw --v 6.1 --stylize 40 --chaos 0
```

**SDXL**（Juggernaut XL / Playground v2.5）
```
(minimalist near-white background:1.3), off-white eggshell base, (one soft gradient blob:1.2) in top-right corner only, {ACCENT_HEX} tint at low saturation, heavily feathered edges dissolving into white, (vast negative space:1.4), matte finish, subtle fine grain, calm empty center, clean flat lower third, high-key soft light, background plate for compositing, no subject
NEG: people, person, face, human, hands, text, letters, typography, watermark, logo, multiple blobs, symmetrical pattern, busy texture, saturated colors, neon, dark background, black, high contrast, hard edges, noise, gradient banding, border, frame, 3d render
832x1472, steps 28, CFG 5, sampler DPM++ 2M Karras, hires fix 1.5x
```
> "vast negative space" を最高重みに（スタイルが競合する前に構図を確定）。"multiple blobs" をネガに入れて2光源事故を防ぐ。

**Ideogram**（MagicPrompt OFF・style_type DESIGN）
```
A vertical 9:16 minimalist background plate, near-white slightly warm off-white with a soft matte paper-like texture. In the top-right corner, a single soft diffuse gradient blob glows gently in {ACCENT_NAME} ({ACCENT_HEX}), fading smoothly into the white with no hard edges. The rest of the frame — especially the center and the lower third — stays completely empty, calm, and free of texture, leaving generous negative space for a framed photo and name text. Soft even light, no shadows, no vignette. This image must contain no people, no faces, no hands, no text, no letters, no logos, and no watermark — purely an abstract gradient background.
aspect_ratio ASPECT_9_16, magic_prompt_option OFF, style_type DESIGN, rendering QUALITY
```
> style_type DESIGN が最もフラット。MagicPrompt OFFで空シーンへの焦点被写体注入を防ぐ。

---

## 6. 共通ネガティブ辞書（必要分をコピー）

- 人物: `people, person, man, woman, human, face, portrait, figure, body, silhouette, hands, fingers, eyes`
- 文字: `text, letters, words, numbers, typography, caption, title, subtitle`
- 標章: `watermark, signature, logo, brand mark, icon, emblem, stamp, seal, hanko`
- 和紙/紙系で必須: `kanji, kana, calligraphy characters`
- 枠: `picture frame, border overlay, heavy vignette`
- 騒がしさ: `busy pattern, clutter, high-frequency detail, bright center hotspot, lens flare rings`
- 品質: `lowres, blurry, jpeg artifacts, oversaturated, neon, noisy grain, deformed, duplicate, 3d render toy look`

## 7. ツール別 縦横比・品質トークン

- **Midjourney**: `--ar 9:16 --style raw --v 6.1`（ネイティブ・正確な9:16）。stylize=calm系40-120／texture系(washi/bright)150-250。chaos 0-5で量産一貫。
- **SDXL**: `832x1472` または `768x1344`（真の9:16バケット。`896x1152`≈7:9は歪む/切れるので避ける）。base+refiner or hires 1.5x, denoise 0.3-0.35。CFG 5-6(柔)〜6-7(硬)。
- **Flux**: `896x1600`（幅高16の倍数）、guidance 3.0-3.5（低め。高いと被写体/文字を捏造）。
- **DALL·E 3**: `1024x1792`（唯一の縦・実質4:7、下をcrop-check）、quality hd, style natural、除外は本文。
- **Ideogram**: `aspect_ratio ASPECT_9_16, magic_prompt_option OFF, style_type DESIGN(minimal)/REALISTIC(washi), rendering QUALITY`。
- **Imagen 3**: `aspectRatio '9:16', personGeneration 'dont_allow'`（no-people最強保証）。
- **nano-banana（Gemini native）**: aspect/person パラなし → 本文に「1080x1920, 9:16 vertical」と書き、出力を目視確認。

## 8. 落とし穴（QAチェックリスト）

1. **Flux dev/schnell はネガティブ欄をほぼ無視**（guidance蒸留）。除外は全部本文に。ネガ欄が効くのは Flux Pro(API) のみ。
2. **DALL·E 3 / nano-banana はネガ欄なし**。除外は末尾1文（"This image must contain no people, no text, no logos…"）で明示。
3. **Ideogram の既定 MagicPrompt** は疎なプロンプトに焦点被写体/装飾文字を注入 → 背景では毎回 OFF。
4. **和紙/紙＋墨系は漢字/書/落款を強く捏造** → 未言及でも必ずネガに列挙。
5. **正プロンプトに地雷名詞を入れない**: `card, sign, label, nameplate, frame(額縁), book cover` は文字/被写体を呼ぶ。`space` 単独は宇宙を呼ぶことも。「calm untouched zone」と書く。
6. **MJ は生hexを不安定にしか読まない** → `{ACCENT_HEX}` は必ず英語色名とペア。Flux/Ideogram はhexをよく読む。
7. **accentは glow/tint/hairline だけ**に。下地には当てない。editorial/washi/minimal は 10-20% 上限（鮮やかな会員色でも抑制ムードを壊さない）。
8. **SDXL非バケット寸法**（例 896x1152≈7:9）は切れる/歪む → 832x1472 か 768x1344。
9. **DALL·E 1024x1792 は≈4:7**（正確な9:16でない）→ 氏名テキスト合成前に下をcrop-check。
10. **既定モデルは frame中央/下中央を過剰点灯**（顔写真＋氏名の位置）→ 全パターンでそこのホットスポットを禁止し、"center"/"lower third"の具体語でゾーン確保。
11. **ネガティブは確率的** → 毎バッチ2-3枚出し、人影/擬似文字/2つ目のブロブ/静寂ゾーンへの漏れがあるものは捨てる。

## 生成の運用手順（ライブラリ方式）

1. パターンを1つ選ぶ → 使いやすいツールの方言でプロンプトを取り、`{ACCENT_NAME}`/`{ACCENT_HEX}` を埋める → **5〜8枚**生成（accent違い/隅違いを混ぜる）。
2. §8のQAで、静寂ゾーンが守れているものだけ採用。
3. `members/_assets/backgrounds/<pattern>/01.jpg 〜` に採番保存。
4. 会員制作時、業種・雰囲気に合う1枚を選び card.js の `background.ref` に指定。
5. こだわり会員には C方式（専用生成）を追加メニューで提案（＝更新課金の上位枠）。
