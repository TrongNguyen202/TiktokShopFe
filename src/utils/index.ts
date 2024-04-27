import { AttributeProduct } from '../types';

export const formatNumber = (str: string) => {
  if (str === undefined || str === null) return '';
  const strFormat = str.toString().replace(/[A-Za-z`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/g, '');
  if (Number(strFormat) >= 1000) {
    return strFormat
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : `${next}.`) + prev;
      });
  }
  if (Number(strFormat) >= 0 && Number(strFormat) < 1000) {
    return Number(strFormat);
  }
  return '';
};

export const getPathByIndex = (index: number) => {
  const path = window.location.pathname;
  const parts = path.split('/');

  if (index >= 0 && index < parts.length) {
    return parts[index];
  }

  return '';
};

export const format = (number: number) => {
  const num = Number(number);
  return num.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

// style: currency, percent
export const IntlNumberFormat = (currency: string, style: string, maximumSignificantDigits: number, number: number) => {
  return new Intl.NumberFormat(currency, {
    style: `${style}`,
    currency: `${currency}`,
    maximumSignificantDigits,
  }).format(number);
};

export const buildNestedArrays = (
  items: any[],
  parentId: number | string,
): { title: string; value: number | string; key: number | string; children: any[] }[] => {
  let nestedItems = [];
  if (items) {
    nestedItems = items.filter((item) => item.parent_id === parentId);
  }

  return nestedItems.map((item) => ({
    title: item.local_display_name,
    value: item.id,
    key: item.id,
    children: buildNestedArrays(items, item.id),
  }));
};

export const buildNestedArraysMenu = (items: any[]) => {
  const itemsByParentId = items.reduce((acc, item) => {
    if (!acc[item.parent_id]) {
      acc[item.parent_id] = [];
    }
    acc[item.parent_id].push(item);
    return acc;
  }, {});

  const buildTree = (parentId: number | string) => {
    const children = itemsByParentId[parentId];
    if (!children) {
      return null;
    }
    return children.map((item: any) => {
      const grandChildren = buildTree(item.id);
      return grandChildren
        ? { label: item.category_name, key: item.id, children: grandChildren, value: item.id }
        : { label: item.category_name, key: item.id, value: item.id };
    });
  };

  return buildTree(0);
};

export const removeDuplicates = (array: any[], keySelector: string) => {
  const cachedObject: { [key: string]: any } = {};
  array.forEach((item) => (cachedObject[item[keySelector]] = item));
  array = Object.values(cachedObject);
  return array;
};

export const flatMapArray = (array1: any[], array2: any[]) => {
  return array1.flatMap((item1) =>
    array2.map((item2) => ({
      data: [{ value_name: item1 }, { value_name: item2 }],
    })),
  );
};

export const ConvertProductAttribute = (product_attributes: AttributeProduct | ArrayLike<unknown>) => {
  const newAttributes =
    product_attributes &&
    Object.entries(product_attributes).map(([id, values]) => ({
      id,
      values,
    }));
  const newAttributeConvert = newAttributes?.filter((item) => item.values);
  if (!newAttributeConvert) return [];
  return newAttributeConvert.map((item) => ({
    attribute_id: item.id,
    attribute_values: (item.values as Array<{ value: string; label: string }>).map((value) => ({
      value_id: value.value,
      value_name: value.label,
    })),
  }));
};
