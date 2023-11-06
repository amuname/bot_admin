import { Update } from 'telegraf/types';
import Context from 'telegraf/typings/context';

// export type ContextUpdateWithMesssageWithText= Context<Update> & { message: { text: 'string' } };
// export function predicateContextWithMessageWithText(ctx: Context<Update>) : ctx is ContextUpdateWithMesssageWithText {
//     return (ctx as ContextUpdateWithMesssageWithText).message.text !== undefined
// }

export function predicateMessageWithText(
  message: Context<Update>['message'],
): message is Context<Update>['message'] & { text: 'string' } {
  return (message as { text: 'string' }).text !== undefined;
}
