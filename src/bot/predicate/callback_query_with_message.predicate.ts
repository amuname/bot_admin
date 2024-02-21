import { Update, Message } from 'telegraf/types';
// import { CallbackQuery }
import Context from 'telegraf/typings/context';

// export type ContextUpdateWithMesssageWithText= Context<Update> & { message: { text: 'string' } };
// export function predicateContextWithMessageWithText(ctx: Context<Update>) : ctx is ContextUpdateWithMesssageWithText {
//     return (ctx as ContextUpdateWithMesssageWithText).message.text !== undefined
// }

export function predicateCallbackQueryWithMessage(
  message: Context<Update>['callbackQuery'],
): message is Context<Update>['callbackQuery'] & { message: Message } {
  return (
    (message as Context<Update>['callbackQuery'] & { message: Message })
      .message !== undefined
  );
}
