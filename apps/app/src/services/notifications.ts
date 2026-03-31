// App 消息服务：当前先用 mock 数据承接消息中心和标记已读，后续再接真实后端接口。
export async function listNotifications() {
  return [
    {
      id: "msg-1",
      title: "商品已上架",
      summary: "你的捐赠已经整理完成并上架",
      readAt: null
    }
  ];
}

export async function markAsRead(id: string) {
  return { id, readAt: new Date().toISOString() };
}
