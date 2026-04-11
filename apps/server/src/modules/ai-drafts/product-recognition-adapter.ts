export type ProductRecognitionInput = {
  imageUrls: string[];
  fallbackTitle: string;
  description?: string;
};

export type ProductRecognitionResult = {
  suggestedCategory: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedTags: string[];
  aiBrand: string;
  aiItemName: string;
  aiAttributes: Record<string, string>;
  provider: string;
};

function mockRecognize(input: ProductRecognitionInput): ProductRecognitionResult {
  const isBook =
    input.fallbackTitle.includes("绘本") ||
    input.fallbackTitle.includes("图书") ||
    input.description?.includes("儿童");
  const sourceAttribute = input.imageUrls.length > 0 ? { 识别来源: "产品图" } : {};

  if (isBook) {
    return {
      suggestedCategory: "图书文具",
      suggestedTitle: "儿童绘本套装",
      suggestedDescription: "大模型已根据产品图与捐赠信息整理出适合上架的图书文案。",
      suggestedTags: ["亲子", "阅读", "公益流转"],
      aiBrand: "爱心品牌",
      aiItemName: "儿童绘本套装",
      aiAttributes: {
        适龄: "6-8岁",
        册数: "8册",
        语言: "中文",
        ...sourceAttribute
      },
      provider: "mock-vision-model"
    };
  }

  return {
    suggestedCategory: "经典影像 / 胶片相机",
    suggestedTitle: "时光掠影，1970s 复古胶片相机",
    suggestedDescription: "大模型已根据产品图与捐赠信息整理后的上架文案。",
    suggestedTags: ["复古", "影像", "收藏"],
    aiBrand: "Canon",
    aiItemName: "胶片相机",
    aiAttributes: {
      年代: "1970s",
      成像方式: "胶片",
      颜色: "黑银",
      ...sourceAttribute
    },
    provider: "mock-vision-model"
  };
}

export interface ProductRecognitionAdapter {
  recognize(input: ProductRecognitionInput): Promise<ProductRecognitionResult>;
}

export class MockProductRecognitionAdapter implements ProductRecognitionAdapter {
  async recognize(input: ProductRecognitionInput) {
    return mockRecognize(input);
  }
}

export class ExternalProductRecognitionAdapter implements ProductRecognitionAdapter {
  constructor(private readonly endpoint: string) {}

  async recognize(input: ProductRecognitionInput) {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      throw new Error("大模型图片识别接口调用失败");
    }

    return (await response.json()) as ProductRecognitionResult;
  }
}

class FallbackProductRecognitionAdapter implements ProductRecognitionAdapter {
  constructor(
    private readonly primary: ProductRecognitionAdapter,
    private readonly fallback: ProductRecognitionAdapter
  ) {}

  async recognize(input: ProductRecognitionInput) {
    try {
      return await this.primary.recognize(input);
    } catch {
      return this.fallback.recognize(input);
    }
  }
}

export function createProductRecognitionAdapter(): ProductRecognitionAdapter {
  const mockAdapter = new MockProductRecognitionAdapter();

  if (process.env.VISION_MODEL_API_URL) {
    return new FallbackProductRecognitionAdapter(
      new ExternalProductRecognitionAdapter(process.env.VISION_MODEL_API_URL),
      mockAdapter
    );
  }

  return mockAdapter;
}
