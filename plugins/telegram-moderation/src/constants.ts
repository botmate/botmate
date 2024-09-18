import { InputBuilder } from '@botmate/ui';

export const NewUserPolicies = [
  { key: 'cannot_send_messages', label: 'Cannot send messages' },
  { key: 'cannot_send_media_messages', label: 'Cannot send media messages' },
  { key: 'cannot_send_other_messages', label: 'Cannot send other messages' },
  {
    key: 'cannot_add_web_page_previews',
    label: 'Cannot add web page previews',
  },
  { key: 'cannot_send_polls', label: 'Cannot send polls' },
  { key: 'cannot_invite_users', label: 'Cannot invite users' },
  { key: 'cannot_pin_messages', label: 'Cannot pin messages' },
  { key: 'cannot_change_chat_info', label: 'Cannot change chat info' },
] as const;

export const AntiSpam = [
  {
    key: 'ban_delete_first_link',
    label: 'Block and remove if the first message has a link (recommended)',
  },
  {
    key: 'ban_delete_first_forward',
    label:
      'Block and remove if the first message is a forwarded one (recommended)',
  },
  {
    key: 'delete_links_new_users',
    label: 'Erase links sent by newly added members',
  },
  {
    key: 'delete_forwards_new_users',
    label: 'Erase forwarded messages from new users',
  },
  {
    key: 'delete_mentions_new_users',
    label: 'Erase mentions from new members',
  },
] as const;

export const CommonFilters = [
  {
    key: 'links',
    label: 'Web Links',
    inputs: new InputBuilder()
      .addRadio('action', {
        label: 'Action',
        defaultValue: 'allow',
        options: [
          { label: 'Allow', value: 'allow' },
          { label: 'Block', value: 'block' },
        ],
      })
      .addString('exception', {
        label: 'Exception',
        note: 'e.g. google.com',
      })
      .addBoolean('warn_on_violation', {
        label: 'Warn on violation',
      }),
  },
  {
    key: 'files',
    label: 'Files',
    inputs: new InputBuilder()
      .addRadio('action', {
        label: 'Action',
        defaultValue: 'allow',
        options: [
          { label: 'Allow', value: 'allow' },
          { label: 'Block', value: 'block' },
        ],
      })
      .addString('exception', {
        label: 'Exception',
        note: 'e.g. image',
      })
      .addNumber('limit_file_size', {
        label: 'Limit file size',
        note: 'in KB',
      }),
  },
] as const;

export const ServiceMessage = [
  {
    key: 'delete_service_new_users',
    label: 'Delete service messages about new members',
  },
  {
    key: 'delete_service_leave_users',
    label: 'Delete service messages about leaving members',
  },
  {
    key: 'delete_service_pin_messages',
    label: 'Delete service messages about pinned messages',
  },
];
