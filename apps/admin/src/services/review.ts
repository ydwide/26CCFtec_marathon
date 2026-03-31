// 后台审核服务：当前先用 mock 数据串起 AI 草稿查看与确认上架，后续再接真实接口。
export async function getReviewDraft(donationCaseId: string) {
  return {
    donationCaseId,
    suggestedTitle: "儿童绘本套装",
    suggestedDescription: "平台整理后的上架文案",
    suggestedCategory: "图书文具",
    suggestedPriceInCents: 2900,
    conditionLabel: "九成新"
  };
}

export async function approveDonationCase(
  donationCaseId: string,
  payload: {
    title: string;
    description: string;
    category: string;
    conditionLabel: string;
    priceInCents: number;
  }
) {
  return {
    id: `product-${donationCaseId}`,
    ...payload
  };
}
