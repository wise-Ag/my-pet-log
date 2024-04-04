"use server";

import instance from "@/app/_api/axios";
import { GetNotificationsRequest, GetNotificationsResponse } from "@/app/_types/notifications/types";

export const getNotifications = async ({ page, size }: GetNotificationsRequest): Promise<GetNotificationsResponse | null> => {
  try {
    const response = await instance.get(`/notifications?page=${page ?? "0"}&size=${size ?? "20"}`);

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error(error.response);
    return null;
  }
};
