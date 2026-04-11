import { FormEvent, useEffect, useState } from "react";
import { approveDonationCase, getReviewDraft, type ReviewDraft } from "../../services/review";

function formatPrice(priceInCents: number) {
  return `¥${(priceInCents / 100).toFixed(2)}`;
}

export function ReviewPage({ donationCaseId }: { donationCaseId: string }) {
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [brand, setBrand] = useState("");
  const [itemName, setItemName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [conditionLabel, setConditionLabel] = useState("");
  const [priceInCents, setPriceInCents] = useState("0");

  useEffect(() => {
    void getReviewDraft(donationCaseId).then((result) => {
      setDraft(result);
      setBrand(result.aiBrand ?? "");
      setItemName(result.aiItemName ?? "");
      setTitle(result.suggestedTitle);
      setDescription(result.suggestedDescription);
      setCategory(result.suggestedCategory);
      setConditionLabel(result.conditionLabel);
      setPriceInCents(String(result.suggestedPriceInCents));
    });
  }, [donationCaseId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await approveDonationCase(donationCaseId, {
      finalBrand: brand,
      finalItemName: itemName,
      finalAttributes: draft?.aiAttributes ?? {},
      finalCategory: category,
      finalConditionLabel: conditionLabel,
      finalTitle: title,
      finalDescription: description,
      finalPriceInCents: Number(priceInCents)
    });
  }

  if (!draft) {
    return <p>加载中...</p>;
  }

  return (
    <form className="review-workbench" onSubmit={handleSubmit}>
      <div className="review-workbench__header">
        <h2>AI 智能整理台</h2>
        <span className="review-status">{draft.statusLabel}</span>
      </div>

      <div className="review-grid">
        <section className="review-card review-card--raw">
          <h3>用户原始提交</h3>
          <div
            className="review-image"
            style={{ backgroundImage: `url(${draft.rawImageUrl ?? ""})` }}
            aria-label="原始物品图片"
          />
          <div className="review-meta-list">
            <p>
              <span>物品名称：</span>
              {draft.rawItemName}
            </p>
            <p>
              <span>所属类别：</span>
              {draft.suggestedCategory}
            </p>
            <div className="review-quote">“{draft.rawDescription}”</div>
          </div>
        </section>

        <section className="review-card review-card--ai">
          <div className="review-card__title-row">
            <h3>AI 智能策展建议</h3>
            <span className="review-confidence">98%</span>
          </div>

          <div className="review-panel-list">
            <div className="review-panel">
              <label htmlFor="review-category">建议类目</label>
              <input id="review-category" value={category} onChange={(event) => setCategory(event.target.value)} />
            </div>
            <div className="review-panel">
              <label htmlFor="review-title">建议标题</label>
              <input id="review-title" value={title} onChange={(event) => setTitle(event.target.value)} />
            </div>
            <div className="review-panel">
              <label htmlFor="review-price">建议价格</label>
              <p className="review-price">{formatPrice(Number(priceInCents))}</p>
              <input id="review-price" value={priceInCents} onChange={(event) => setPriceInCents(event.target.value)} />
            </div>
          </div>

          <div className="review-detail-grid">
            <label className="review-field">
              <span>品牌</span>
              <input value={brand} onChange={(event) => setBrand(event.target.value)} />
            </label>
            <label className="review-field">
              <span>物品名称</span>
              <input value={itemName} onChange={(event) => setItemName(event.target.value)} />
            </label>
          </div>

          <div className="review-attributes">
            {Object.entries(draft.aiAttributes ?? {}).map(([key, value]) => (
              <span key={key} className="review-tag">{`${key}：${value}`}</span>
            ))}
          </div>

          <div className="review-market-card">
            <h4>市场参考样本</h4>
            <div className="review-pricing-summary" aria-label="AI 定价摘要">
              <p>
                <span>市场均价</span>
                <strong>{formatPrice(draft.averagePriceInCents)}</strong>
              </p>
              <p>
                <span>查价关键词</span>
                <strong>{draft.priceQuery}</strong>
              </p>
              <p>
                <span>定价理由</span>
                <strong>{draft.pricingReason}</strong>
              </p>
            </div>
            <ul>
              {(draft.priceSamples ?? []).map((sample) => (
                <li key={sample.id}>
                  <span>{sample.sourcePlatform}</span>
                  <strong>{sample.sampleTitle}</strong>
                  <em>{formatPrice(sample.samplePrice)}</em>
                </li>
              ))}
            </ul>
            <p className="review-range">
              价格区间：{formatPrice(draft.priceRange?.min ?? 0)} - {formatPrice(draft.priceRange?.max ?? 0)}
            </p>
          </div>

          <label className="review-description">
            <span>描述</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </label>

          <label className="review-field review-field--single">
            <span>成色</span>
            <input value={conditionLabel} onChange={(event) => setConditionLabel(event.target.value)} />
          </label>

          <div className="review-actions">
            <button type="submit" className="review-actions__primary">采纳建议并提交审核</button>
            <button type="button" className="review-actions__secondary">重新生成</button>
            <button type="button" className="review-actions__dark">手动微调</button>
          </div>
        </section>
      </div>
    </form>
  );
}
