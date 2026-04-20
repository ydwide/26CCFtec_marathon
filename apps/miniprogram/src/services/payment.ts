// 支付服务：当前封装一个可替换的支付入口，后续可以换成小程序真实支付能力。
export const payment = {
  async request(payload: unknown) {
    return payload;
  }
};
