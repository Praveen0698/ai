/*****
@author: KayJayGlobal
@purpose: This component has Utility function to format context data into a string

******/

export const formatContextFromData = (data: { [key: string]: any }): string => {
  return Object.entries(data)
    .map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return `${
          key.charAt(0).toUpperCase() + key.slice(1)
        }:\n${formatContextFromData(value)}`;
      }
      return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
    })
    .join("\n");
};
