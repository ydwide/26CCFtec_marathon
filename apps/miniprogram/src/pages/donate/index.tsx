import { FormEvent, useState } from "react";
import { createDonationCase } from "../../services/donations";
import { navigation } from "../../services/navigation";

export function DonatePage() {
  const [title, setTitle] = useState("");
  const [conditionLabel, setConditionLabel] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await createDonationCase({
      title,
      conditionLabel,
      description,
      imageUrls: imageUrl ? [imageUrl] : []
    });

    navigation.navigateTo("/pages/donate-success/index");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        产品图
        <input
          aria-label="产品图"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="先填写图片地址，后续接真实上传"
        />
      </label>

      <label>
        物品名称
        <input
          aria-label="物品名称"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label>
        成色
        <input
          aria-label="成色"
          value={conditionLabel}
          onChange={(event) => setConditionLabel(event.target.value)}
        />
      </label>

      <label>
        补充说明
        <textarea
          aria-label="补充说明"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <button type="submit">提交捐赠</button>
    </form>
  );
}
