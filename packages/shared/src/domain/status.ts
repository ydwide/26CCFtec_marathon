export enum DonationStatus {
  Submitted = "已提交",
  Received = "待接收",
  AiProcessing = "AI整理中",
  PendingReview = "待审核",
  PendingPublish = "待上架",
  Published = "已上架",
  Rejected = "已驳回",
  Completed = "已完成"
}

export enum ProductStatus {
  Draft = "草稿中",
  PendingReview = "待审核",
  PendingPublish = "待上架",
  OnSale = "销售中",
  Locked = "已锁定",
  Sold = "已售出",
  OffShelf = "已下架"
}

export enum OrderStatus {
  PendingPayment = "待支付",
  Paid = "已支付",
  PendingFulfillment = "待发货/待交付",
  InTransit = "流转中",
  Completed = "已完成",
  Cancelled = "已取消",
  Exception = "异常订单"
}
