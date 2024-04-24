"use server";

import instance from "@/app/_api/axios";
import { GetNotificationsRequest, GetNotificationsResponse } from "@/app/_types/notifications/types";

export const getNotifications = async ({ page, size }: GetNotificationsRequest): Promise<GetNotificationsResponse | null> => {
  if (page === undefined) return null;
  try {
    const response = await instance.get(`/notifications?page=${page}&size=${size ?? "5"}&sort=string`);

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

export const postNotifications = async () => {
  await instance.post("/notifications/read-all");
};

export const deleteNotifications = async () => {
  try {
    const response = await instance.delete("/notifications");

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
