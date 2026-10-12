import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'
import { SEMESTERS } from '../../lib/semesters'

export const poster = defineType({
  name: 'poster',
  title: 'Poster',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Poster',
      type: 'image',
      description: 'Upload the largest version you have (ideally 3000 px or more on the long side).',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'First name and last name, e.g. "Anna Muster".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      initialValue: () => new Date().getFullYear(),
      validation: (rule) => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: 'semester',
      title: 'Semester',
      type: 'string',
      options: {
        list: SEMESTERS.map((s) => ({ title: s, value: s })),
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Year, newest first',
      name: 'yearDesc',
      by: [
        { field: 'year', direction: 'desc' },
        { field: '_createdAt', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { name: 'name', year: 'year', semester: 'semester', media: 'image' },
    prepare: ({ name, year, semester, media }) => ({
      title: name || 'Untitled',
      subtitle: [semester, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
