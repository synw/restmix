[Restmix documentation](../README.md) / api

# Module: api

## Table of contents

### Functions

- [useApi](api.md#useapi)

## Functions

### useApi

▸ **useApi**(`params?`): `Object`

The main api composable

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`UseApiParams`](../interfaces/interfaces.UseApiParams.md) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `csrfToken` | ``null`` |
| `del` | <T\>(`uri`: `string`, `verbose`: `boolean`) => `Promise`<[`ApiResponse`](../interfaces/interfaces.ApiResponse.md)<`T`\>\> |
| `get` | <T\>(`uri`: `string`, `verbose`: `boolean`) => `Promise`<[`ApiResponse`](../interfaces/interfaces.ApiResponse.md)<`T`\>\> |
| `hasCsrfCookie` | () => `boolean` |
| `patch` | <T\>(`uri`: `string`, `payload`: `any`[] \| `Record`<`string`, `any`\>, `verbose`: `boolean`) => `Promise`<[`ApiResponse`](../interfaces/interfaces.ApiResponse.md)<`T`\>\> |
| `post` | <T\>(`uri`: `string`, `payload`: `any`[] \| `FormData` \| `Record`<`string`, `any`\>, `multipart`: `boolean`, `verbose`: `boolean`) => `Promise`<[`ApiResponse`](../interfaces/interfaces.ApiResponse.md)<`T`\>\> |
| `put` | <T\>(`uri`: `string`, `payload`: `any`[] \| `Record`<`string`, `any`\>, `verbose`: `boolean`) => `Promise`<[`ApiResponse`](../interfaces/interfaces.ApiResponse.md)<`T`\>\> |
| `setCsrfToken` | (`token`: `string`) => `void` |
| `setCsrfTokenFromCookie` | (`verbose`: `boolean`) => `boolean` |

#### Defined in

[api.ts:5](https://github.com/synw/restmix/blob/d06c9c4/src/api.ts#L5)
