import dayjs from "dayjs";
import {SimplePromiseMemoryCache} from "../ui/SimplePromiseMemoryCache";
import utc from 'dayjs/plugin/utc'
import {unixMs} from "../utils/Utils";
import {GetLogsRequest, GetLogsResponse, LoggyApi, parseLogResponse} from "./Api";
import objectSupport from "dayjs/plugin/objectSupport";
import {Day} from "../core/Day";
import {Analytics, DayBreakdown} from "../ui/AnalyticsGraph";
import {PromiseMemoryCache} from "../fudge-lib/collections/PromiseMemoryCache";
import {recordToArray} from "../fudge-lib/methods/Javascript";
import {DebugEndpoint, endpointFromString, isDebugEndpoint, NormalEndpoint, SpecialEndpoint} from "../model/Endpoint";
import {badAppearanceTestLog, testLogResponse} from "../test/TestEvents";

dayjs.extend(utc)
dayjs.extend(objectSupport);


export namespace LoggingServer {
    export async function getEndpoints(): Promise<NormalEndpoint[]> {
        return endpointCache.get(() => LoggyApi.getEndpoints())
    }

    const endpointCache = new SimplePromiseMemoryCache<NormalEndpoint[]>()


    export async function getLogs(query: GetLogsRequest): Promise<GetLogsResponse> {
        const endpoint = endpointFromString(query.endpoint)
        if (isDebugEndpoint(endpoint)) {
            return parseLogResponse(getDebugLog(endpoint))
        } else {
            return logsCache.get(encodeQueryAsKey(query), () => LoggyApi.getLogs(query))
        }
    }

    function getDebugLog(endpoint: DebugEndpoint): string {
        switch (endpoint) {
            case SpecialEndpoint.DebugSimple:
            case SpecialEndpoint.DebugContentBomb:
                // Disable content bomb since it bombs the bundle size as well
            // return contentBombTestLog
            // eslint-disable-next-line no-fallthrough
            case SpecialEndpoint.DebugLongEndpointName:
                return testLogResponse
            case SpecialEndpoint.DebugBadAppareance:
                return badAppearanceTestLog
        }
    }

    function encodeQueryAsKey(query: GetLogsRequest): string {
        return encodeAsKey(query.query, query.endpoint, query.page)
    }


    // 23, 59, 59, 999_999_999

    export function refreshLog(query: GetLogsRequest) {
        void logsCache.replace(encodeQueryAsKey(query), LoggyApi.getLogs(query))
    }

    const logsCache = new PromiseMemoryCache<GetLogsResponse>()

    export async function getAnalytics(endpoint: string, startDay: Day, endDay: Day): Promise<Analytics> {
        const startDate = startDay.start()
        const endDate = endDay.end()
        return analyticsCache.get(encodeAsKey(endpoint, unixMs(startDate), unixMs(endDate)),
            async () => {
                const response = await LoggyApi.getAnalytics({endpoint, startDate, endDate})
                return recordToArray(response, (unixMs: string, breakdown: DayBreakdown) => [Day.ofUnixMs(parseInt(unixMs)), breakdown]);
            })
    }

    function encodeAsKey(...stuff: unknown[]): string {
        return stuff.join()
    }

    const analyticsCache = new PromiseMemoryCache<Analytics>()

}

