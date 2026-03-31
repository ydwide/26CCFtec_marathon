// AI 整理台：给运营人员查看 AI 生成的分类、标题、描述和建议价格。
export function AiWorkbenchPage() {
  const suggestion = {
    title: "儿童绘本套装",
    category: "图书文具",
    description: "平台整理后的上架文案",
    priceInCents: 2900
  };

  return (
    <section>
      <h1>AI 整理台</h1>
      <p>建议标题：{suggestion.title}</p>
      <p>建议分类：{suggestion.category}</p>
      <p>建议价格：{suggestion.priceInCents / 100} 元</p>
      <p>{suggestion.description}</p>
    </section>
  );
}
