import { AdminChatState, PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function prismaCreateAdmin(
  tg_id: number,
  tg_name: string,
  disabled: boolean,
  tg_data: string,
  phoneNumber?: string,
  chatState?: AdminChatState,
) {
  // const bot = await prismaFindFirstParserBot();
  return prisma.admin.upsert({
    create: {
      tg_user_id: tg_id,
      tg_name,
      disabled,
      tg_data,
      phoneNumber,
      chatState,
      InvitationalUUID: {
        create: {},
      },
      // ParserBot: {
      //   connect: {
      //     id: bot.id,
      //   },
      // },
    },
    update: {
      tg_name,
      disabled,
      tg_data,
    },
    where: {
      tg_user_id: tg_id,
    },
  });
}

export function prismaFindFirstParserBot() {
  return prisma.parserBot.findFirst();
}

export async function prismaAddAdminToParserBotNoId(admin_id: number) {
  const bot = await prismaFindFirstParserBot();
  return prisma.parserBot.update({
    where: {
      id: bot.id,
    },
    data: {
      Admin: {
        connect: {
          tg_user_id: admin_id,
        },
      },
    },
  });
}

export function prismaAddAdminToParserBot(admin_id: number, bot_id: number) {
  return prisma.parserBot.update({
    where: {
      id: bot_id,
    },
    data: {
      Admin: {
        connect: {
          tg_user_id: admin_id,
        },
      },
    },
  });
}

export function prismaCreateAdminChannel(
  channel_url: string,
  tg_user_id: number,
  is_private?: boolean,
  is_avalible_to_read?: boolean,
) {
  return prisma.channel.upsert({
    create: {
      channel_url,
      admins: {
        connect: {
          tg_user_id,
        },
      },
    },
    update: {
      is_private,
      is_avalible_to_read,
    },
    where: {
      channel_url,
    },
  });
}

export function prismaFindUnique(
  tg_id: number,
  activeChannels = false,
  channel = false,
) {
  return prisma.admin.findUnique({
    where: {
      tg_user_id: tg_id,
    },
    select: {
      InvitationalUUID: true,
      ParserBot: true,
      activeChannels,
      channel,
      chatState: true,
    },
  });
}

export function prismaSetUserState(
  tg_user_id: number,
  chatState: AdminChatState,
) {
  return prisma.admin.update({
    where: {
      tg_user_id,
    },
    data: {
      chatState,
    },
  });
}

export function prismaGetUserChannels(tg_user_id: number) {
  return prisma.admin.findUnique({
    where: {
      tg_user_id,
    },
    select: {
      channel: true,
    },
  });
}

export function prismaCreateAdminChannelConfig(
  tg_user_id: number,
  channel_url: string,
  keywords: string,
  is_active: boolean,
) {
  return prisma.channelConfig.create({
    data: {
      keywords,
      is_active,
      channel: {
        connect: {
          channel_url,
        },
      },
      admin: {
        connect: {
          tg_user_id,
        },
      },
    },
  });
}

export function prismaFindUserByInvitational(inviteUUID: string) {
  return prisma.invitationalUUID.findUnique({
    where: {
      id: inviteUUID,
    },
  });
}

export function prismaCreateActiveChannel(
  activeChannelId: string,
  adminId: number,
  title: string,
  username: string,
) {
  return prisma.activeChannel.upsert({
    where: {
      id: activeChannelId,
    },
    update: {
      channelTitle: title,
      channelUserName: username,
      admin: {
        connect: {
          tg_user_id: adminId,
        },
      },
    },
    create: {
      id: activeChannelId,
      admin: {
        connect: {
          tg_user_id: adminId,
        },
      },
    },
  });
}

export function getChannelWithConfigByChannelId(channel_id: string) {
  return prisma.channel.findUnique({
    where: {
      channel_url: channel_id,
    },
    include: {
      config: true,
    },
  });
}

export async function connectConfigToActiveChannelByChannelId(
  channel_id: string,
  active_channel_id: string,
) {
  const channel = await getChannelWithConfigByChannelId(channel_id);

  const config_id = channel.config.id;

  return prisma.channelConfig.update({
    where: {
      id: config_id,
    },
    data: {
      activeChannel: {
        connect: {
          id: active_channel_id,
        },
      },
    },
  });
}

export function createParserTaskWithChannelId(channel_id: string) {
  // TODO подумать над проверкой что
  return prisma.parserTask.create
}
