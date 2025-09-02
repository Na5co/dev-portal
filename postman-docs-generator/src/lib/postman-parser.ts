import {
  Collection,
  Item,
  ItemGroup,
  Request,
  Response,
  DescriptionDefinition,
  RequestAuth,
} from 'postman-collection';

export interface ParsedCollection {
  name: string;
  description?: string;
  items: ParsedItem[];
}

export interface ParsedItem {
  id: string;
  name: string;
  description?: string;
  type: 'request' | 'folder';
  request?: ParsedRequest;
  rawRequest?: object;
  items?: ParsedItem[];
}

export interface ParsedRequest {
  method: string;
  url: string;
  auth?: ParsedAuth;
  headers?: Array<{ key: string; value: string; description?: string }>;
  body?: {
    mode: string;
    raw?: string;
    formdata?: Array<{ key: string; value: string; type: string }>;
  };
  examples?: ParsedResponse[];
}

export interface ParsedAuth {
  type: string;
  [key: string]: unknown;
}

export interface ParsedResponse {
  name: string;
  status: string;
  code: number;
  headers?: Array<{ key: string; value: string }>;
  body?: string;
}

function getDescriptionText(
  description: string | DescriptionDefinition | undefined
): string | undefined {
  if (!description) return undefined;
  if (typeof description === 'string') return description;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (description as any).content || description.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parsePostmanCollection(jsonData: any): ParsedCollection {
  console.log('Raw JSON data:', jsonData);

  try {
    const collection = new Collection(jsonData);
    console.log('Parsed collection:', collection);
    console.log('Collection items:', collection.items);
    console.log('Items count:', collection.items.count());

    const parsedItems = parseItems(collection.items.all());
    console.log('Parsed items:', parsedItems);

    return {
      name: collection.name || 'Untitled Collection',
      description: getDescriptionText(collection.description),
      items: parsedItems,
    };
  } catch (error) {
    console.error('Error parsing collection:', error);
    throw error;
  }
}

function parseItems(items: (Item | ItemGroup<Item>)[]): ParsedItem[] {
  console.log('Parsing items:', items);

  return items.map((item, index) => {
    console.log(`Processing item ${index}:`, item);

    if (item instanceof ItemGroup) {
      // This is a folder
      const folderItems = item.items.all();
      console.log(
        `Folder "${item.name}" has ${folderItems.length} items:`,
        folderItems
      );

      return {
        id: item.id || generateId(),
        name: item.name || 'Untitled Folder',
        description: getDescriptionText(item.description),
        type: 'folder' as const,
        items: parseItems(folderItems),
      };
    } else {
      // This is a request
      return {
        id: item.id || generateId(),
        name: item.name || 'Untitled Request',
        description: getDescriptionText(item.description),
        type: 'request' as const,
        request: parseRequest(item.request, item.responses?.all() || []),
        rawRequest: item.request.toJSON(),
      };
    }
  });
}

function parseRequest(request: Request, responses: Response[]): ParsedRequest {
  const url = request.url?.toString() || '';
  const method = request.method?.toString().toUpperCase() || 'GET';

  const auth = request.auth ? parseAuth(request.auth) : undefined;

  console.log(`Parsing request: ${method} ${url}`);

  // Parse headers
  const headers =
    request.headers?.all().map((header) => ({
      key: header.key,
      value: header.value,
      description: getDescriptionText(header.description),
    })) || [];

  // Parse body
  let body;
  if (request.body) {
    body = {
      mode: request.body.mode || 'none',
      raw: request.body.raw,
      formdata: request.body.formdata?.all().map((param) => ({
        key: param.key,
        value: param.value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: (param as any).type || 'text',
      })),
    };
  }

  // Parse example responses
  const examples = responses.map((response) => ({
    name: response.name || 'Example Response',
    status: response.status || 'OK',
    code: response.code || 200,
    headers:
      response.headers?.all().map((header) => ({
        key: header.key,
        value: header.value,
      })) || [],
    body: response.body,
  }));

  return {
    method,
    url,
    auth,
    headers: headers.length > 0 ? headers : undefined,
    body,
    examples: examples.length > 0 ? examples : undefined,
  };
}

function parseAuth(auth: RequestAuth): ParsedAuth | undefined {
  const authJson = auth.toJSON();
  if (!authJson || !authJson.type) return undefined;

  const parsedAuth: ParsedAuth = {
    type: authJson.type,
  };

  if (authJson[authJson.type]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authJson[authJson.type] as any[]).forEach((param) => {
      parsedAuth[param.key] = param.value;
    });
  }

  return parsedAuth;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
