export type Endpoint = NormalEndpoint | SpecialEndpoint
// We do this intersection trick to not allow to convert from string to Endpoint willy nilly
export type NormalEndpoint = (string & "all")

export enum SpecialEndpoint {
    All,
    DebugSimple,
    DebugBadAppareance,
    DebugContentBomb,
    DebugLongEndpointName
}

export const debugEndpoints: DebugEndpoint[] = [
    SpecialEndpoint.DebugSimple, SpecialEndpoint.DebugBadAppareance, SpecialEndpoint.DebugContentBomb, SpecialEndpoint.DebugLongEndpointName
]

export type DebugEndpoint = Exclude<SpecialEndpoint, SpecialEndpoint.All>

export function isSpecialEndpoint(endpoint: Endpoint): endpoint is SpecialEndpoint {
    return typeof endpoint === "number"
}

export function isDebugEndpoint(endpoint: Endpoint): endpoint is DebugEndpoint {
    return isSpecialEndpoint(endpoint) && endpoint !== SpecialEndpoint.All
}

export function endpointFromString(string: string): Endpoint {
    switch (string.toLowerCase()) {
        case "all":
        case "":
            return SpecialEndpoint.All
        case "debug1":
        case "debugsimple":
            return SpecialEndpoint.DebugSimple
        case "debug2":
        case "debugbadapp":
            return SpecialEndpoint.DebugBadAppareance
        case "debug3":
        case "debugcontentbomb":
            return SpecialEndpoint.DebugContentBomb
        case "debug4":
        case "debuglongendpoint":
        case "debug very long thing of hell":
            return SpecialEndpoint.DebugContentBomb
        default:
            return string as Endpoint
    }
}

export function endpointToString(endpoint: Endpoint): string {
    if (isSpecialEndpoint(endpoint)) {
        switch (endpoint) {
            case SpecialEndpoint.All:
                return "All"
            case SpecialEndpoint.DebugSimple:
                return "debugSimple"
            case SpecialEndpoint.DebugBadAppareance:
                return "debugBadApp"
            case SpecialEndpoint.DebugContentBomb:
                return "debugContentBomb"
            case SpecialEndpoint.DebugLongEndpointName:
                return "debug very long thing of hell"
        }
    } else {
        return endpoint
    }
}