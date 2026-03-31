import { FormEvent, useEffect, useState } from "react";
import { approveDonationCase, getReviewDraft } from "../../services/review";

type ReviewDraft = {
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedCategory: string;
  suggestedPriceInCents: number;
  conditionLabel: string;
};

// 审核上架页：工作人员在这里确认 AI 草稿并提交商品上架。
export function ReviewPage({ donationCaseId }: { donationCaseId: string }) {
  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priceInCents, setPriceInCents] = useState("0");
  const [conditionLabel, setConditionLabel] = useState("");

  useEffect(() => {
    void getReviewDraft(donationCaseId).then((result) => {
      setDraft(result);
      setTitle(result.suggestedTitle);
      setDescription(result.suggestedDescription);
      setCategory(result.suggestedCategory);
      setPriceInCents(String(result.suggestedPriceInCents));
      setConditionLabel(result.conditionLabel);
    });
  }, [donationCaseId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await approveDonationCase(donationCaseId, {
      title,
      description,
      category,
      conditionLabel,
      priceInCents: Number(priceInCents)
    });
  }

  if (!draft) {
    return <p>加载中...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>审核上架</h1>

      <label>
        商品标题
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>

      <label>
        描述
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>

      <label>
        分类
        <input value={category} onChange={(event) => setCategory(event.target.value)} />
      </label>

      <label>
        成色
        <input
          value={conditionLabel}
          onChange={(event) => setConditionLabel(event.target.value)}
        />
      </label>

      <label>
        价格
        <input value={priceInCents} onChange={(event) => setPriceInCents(event.target.value)} />
      </label>

      <button type="submit">确认上架</button>
    </form>
  );
}
