import React from "react";
import { Icon } from "@iconify/react";

export const sidebarItems1 = [
  {
    path: "/dashboard",
    icon: <Icon icon="bi:speedometer2"></Icon>,
    title: "Dashboard",
  },
  {
    path: "/users",
    icon: <Icon icon="mdi:users"></Icon>,
    title: "Staff Management",
  },
  {
    path: "/clients",
    icon: <Icon icon="mdi:users-group"></Icon>,
    title: "Client Management",
  }
];

export const sidebarItems2 = [
  {
    path: "/quote",
    icon: <Icon icon="material-symbols:request-quote-outline-rounded"></Icon>,
    title: "Quotation Management",
  },
  {
    path: "/sms",
    icon: <Icon icon="fa6-solid:comment-sms"></Icon>,
    title: "SMS Management",
  },
  {
    path: "/payment",
    icon: <Icon icon="uiw:pay"></Icon>,
    title: "Payment Management",
  },
];
export const sidebarItems3 = [
  {
    path: "/client-report",
    icon: <Icon icon="heroicons-solid:document"></Icon>,
    title: "Client Details",
  },
  {
    path: "/quote-report",
    icon: <Icon icon="heroicons-solid:document"></Icon>,
    title: "Quotation Details",
  },
  {
    path: "/sms-report",
    icon: <Icon icon="heroicons-solid:document"></Icon>,
    title: "SMS Details",
  },
  {
    path: "/payment-report",
    icon: <Icon icon="heroicons-solid:document"></Icon>,
    title: "Payment Details",
  }
];