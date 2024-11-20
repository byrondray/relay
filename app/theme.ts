import defaultTheme from '@eva-design/eva';

export const myTheme = {
  ...defaultTheme,

  // Define your color palette
  "color-primary-100": "#FFF0D6",
  "color-primary-200": "#FFDDAD",
  "color-primary-300": "#FFC584",
  "color-primary-400": "#FFAE66",
  "color-primary-500": "#FF8833",
  "color-primary-600": "#DB6625",
  "color-primary-700": "#B74919",
  "color-primary-800": "#933010",
  "color-primary-900": "#7A1E09",
  "color-success-100": "#F2FDD2",
  "color-success-200": "#E2FCA5",
  "color-success-300": "#CCF877",
  "color-success-400": "#B5F255",
  "color-success-500": "#93EA20",
  "color-success-600": "#74C917",
  "color-success-700": "#59A810",
  "color-success-800": "#41870A",
  "color-success-900": "#307006",
  "color-info-100": "#CFFEF5",
  "color-info-200": "#A0FEF4",
  "color-info-300": "#70FDF9",
  "color-info-400": "#4DF2FB",
  "color-info-500": "#13DBF9",
  "color-info-600": "#0DACD6",
  "color-info-700": "#0982B3",
  "color-info-800": "#065D90",
  "color-info-900": "#034377",
  "color-warning-100": "#FFFAD5",
  "color-warning-200": "#FFF3AC",
  "color-warning-300": "#FFEB82",
  "color-warning-400": "#FFE263",
  "color-warning-500": "#FFD530",
  "color-warning-600": "#DBB223",
  "color-warning-700": "#B79018",
  "color-warning-800": "#93700F",
  "color-warning-900": "#7A5909",
  "color-danger-100": "#FFEEDD",
  "color-danger-200": "#FFDABC",
  "color-danger-300": "#FFC09B",
  "color-danger-400": "#FFA782",
  "color-danger-500": "#FF7F59",
  "color-danger-600": "#DB5941",
  "color-danger-700": "#B7382C",
  "color-danger-800": "#931D1C",
  "color-danger-900": "#7A1117",

  // Extend the theme to customize specific components
  components: {
    ...defaultTheme,

    Datepicker: {
      appearances: {
        default: {
          mapping: {
            borderWidth: 0, // Removes the border
            borderColor: 'transparent', // Ensures the border is invisible
          },
        },
      },
    },
  },
  
};
