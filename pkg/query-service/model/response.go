package model

import (
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"time"

	"github.com/prometheus/prometheus/promql"
	"github.com/prometheus/prometheus/util/stats"
	"k8s.io/apimachinery/pkg/labels"
)

type ApiError struct {
	Typ ErrorType
	Err error
}
type ErrorType string

const (
	ErrorNone           ErrorType = ""
	ErrorTimeout        ErrorType = "timeout"
	ErrorCanceled       ErrorType = "canceled"
	ErrorExec           ErrorType = "execution"
	ErrorBadData        ErrorType = "bad_data"
	ErrorInternal       ErrorType = "internal"
	ErrorUnavailable    ErrorType = "unavailable"
	ErrorNotFound       ErrorType = "not_found"
	ErrorNotImplemented ErrorType = "not_implemented"
	ErrorUnauthorized   ErrorType = "unauthorized"
	ErrorForbidden      ErrorType = "forbidden"
	ErrorConflict       ErrorType = "conflict"
)

type QueryDataV2 struct {
	ResultType promql.ValueType `json:"resultType"`
	Result     promql.Value     `json:"result"`
}

type QueryData struct {
	ResultType promql.ValueType  `json:"resultType"`
	Result     promql.Value      `json:"result"`
	Stats      *stats.QueryStats `json:"stats,omitempty"`
}

type RuleResponseItem struct {
	Id        int       `json:"id" db:"id"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Data      string    `json:"data" db:"data"`
}

type TTLStatusItem struct {
	Id             int       `json:"id" db:"id"`
	UpdatedAt      time.Time `json:"updated_at" db:"updated_at"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
	TableName      string    `json:"table_name" db:"table_name"`
	TTL            int       `json:"ttl" db:"ttl"`
	Status         string    `json:"status" db:"status"`
	ColdStorageTtl int       `json:"cold_storage_ttl" db:"cold_storage_ttl"`
}

type ChannelItem struct {
	Id        int       `json:"id" db:"id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Name      string    `json:"name" db:"name"`
	Type      string    `json:"type" db:"type"`
	Data      string    `json:"data" db:"data"`
}

// AlertDiscovery has info for all active alerts.
type AlertDiscovery struct {
	Alerts []*AlertingRuleResponse `json:"rules"`
}

// Alert has info for an alert.
type AlertingRuleResponse struct {
	Labels      labels.Labels `json:"labels"`
	Annotations labels.Labels `json:"annotations"`
	State       string        `json:"state"`
	Name        string        `json:"name"`
	Id          int           `json:"id"`
	// ActiveAt    *time.Time    `json:"activeAt,omitempty"`
	// Value       float64       `json:"value"`
}

type ServiceItem struct {
	ServiceName  string  `json:"serviceName" ch:"serviceName"`
	Percentile99 float64 `json:"p99" ch:"p99"`
	AvgDuration  float64 `json:"avgDuration" ch:"avgDuration"`
	NumCalls     uint64  `json:"numCalls" ch:"numCalls"`
	CallRate     float64 `json:"callRate" ch:"callRate"`
	NumErrors    uint64  `json:"numErrors" ch:"numErrors"`
	ErrorRate    float64 `json:"errorRate" ch:"errorRate"`
	Num4XX       uint64  `json:"num4XX" ch:"num4xx"`
	FourXXRate   float64 `json:"fourXXRate" ch:"fourXXRate"`
}
type ServiceErrorItem struct {
	Time      time.Time `json:"time" ch:"time"`
	Timestamp int64     `json:"timestamp" ch:"timestamp"`
	NumErrors uint64    `json:"numErrors" ch:"numErrors"`
}
type ServiceOverviewItem struct {
	Time         time.Time `json:"time" ch:"time"`
	Timestamp    int64     `json:"timestamp" ch:"timestamp"`
	Percentile50 float64   `json:"p50" ch:"p50"`
	Percentile95 float64   `json:"p95" ch:"p95"`
	Percentile99 float64   `json:"p99" ch:"p99"`
	NumCalls     uint64    `json:"numCalls" ch:"numCalls"`
	CallRate     float64   `json:"callRate" ch:"callRate"`
	NumErrors    uint64    `json:"numErrors" ch:"numErrors"`
	ErrorRate    float64   `json:"errorRate" ch:"errorRate"`
}

type SearchSpansResult struct {
	Columns []string        `json:"columns"`
	Events  [][]interface{} `json:"events"`
}

type GetFilterSpansResponseItem struct {
	Timestamp          time.Time `ch:"timestamp" json:"timestamp"`
	SpanID             string    `ch:"spanID" json:"spanID"`
	TraceID            string    `ch:"traceID" json:"traceID"`
	ServiceName        string    `ch:"serviceName" json:"serviceName"`
	Operation          string    `ch:"name" json:"operation"`
	DurationNano       uint64    `ch:"durationNano" json:"durationNano"`
	HttpCode           string    `ch:"httpCode"`
	HttpMethod         string    `ch:"httpMethod"`
	GRPCode            string    `ch:"gRPCCode"`
	GRPMethod          string    `ch:"gRPCMethod"`
	StatusCode         string    `json:"statusCode"`
	Method             string    `json:"method"`
	ResponseStatusCode string    `ch:"responseStatusCode"`
	RPCMethod          string    `ch:"rpcMethod"`
}

type GetFilterSpansResponse struct {
	Spans      []GetFilterSpansResponseItem `json:"spans"`
	TotalSpans uint64                       `json:"totalSpans"`
}

type SearchSpanDBReponseItem struct {
	Timestamp time.Time `ch:"timestamp"`
	TraceID   string    `ch:"traceID"`
	Model     string    `ch:"model"`
}

type Event struct {
	Name         string                 `json:"name,omitempty"`
	TimeUnixNano uint64                 `json:"timeUnixNano,omitempty"`
	AttributeMap map[string]interface{} `json:"attributeMap,omitempty"`
	IsError      bool                   `json:"isError,omitempty"`
}

type SearchSpanReponseItem struct {
	TimeUnixNano uint64            `json:"timestamp"`
	SpanID       string            `json:"spanID"`
	TraceID      string            `json:"traceID"`
	ServiceName  string            `json:"serviceName"`
	Name         string            `json:"name"`
	Kind         int32             `json:"kind"`
	References   []OtelSpanRef     `json:"references,omitempty"`
	DurationNano int64             `json:"durationNano"`
	TagMap       map[string]string `json:"tagMap"`
	Events       []string          `json:"event"`
	HasError     bool              `json:"hasError"`
}

type OtelSpanRef struct {
	TraceId string `json:"traceId,omitempty"`
	SpanId  string `json:"spanId,omitempty"`
	RefType string `json:"refType,omitempty"`
}

func (ref *OtelSpanRef) toString() string {

	retString := fmt.Sprintf(`{TraceId=%s, SpanId=%s, RefType=%s}`, ref.TraceId, ref.SpanId, ref.RefType)

	return retString
}

func (item *SearchSpanReponseItem) GetValues() []interface{} {

	references := []OtelSpanRef{}
	jsonbody, _ := json.Marshal(item.References)
	json.Unmarshal(jsonbody, &references)

	referencesStringArray := []string{}
	for _, item := range references {
		referencesStringArray = append(referencesStringArray, item.toString())
	}

	if item.Events == nil {
		item.Events = []string{}
	}
	keys := make([]string, 0, len(item.TagMap))
	values := make([]string, 0, len(item.TagMap))

	for k, v := range item.TagMap {
		keys = append(keys, k)
		values = append(values, v)
	}
	returnArray := []interface{}{item.TimeUnixNano, item.SpanID, item.TraceID, item.ServiceName, item.Name, strconv.Itoa(int(item.Kind)), strconv.FormatInt(item.DurationNano, 10), keys, values, referencesStringArray, item.Events, item.HasError}

	return returnArray
}

type UsageItem struct {
	Time      time.Time `json:"time,omitempty" ch:"time"`
	Timestamp uint64    `json:"timestamp" ch:"timestamp"`
	Count     uint64    `json:"count" ch:"count"`
}

type TopOperationsItem struct {
	Percentile50 float64 `json:"p50" ch:"p50"`
	Percentile95 float64 `json:"p95" ch:"p95"`
	Percentile99 float64 `json:"p99" ch:"p99"`
	NumCalls     uint64  `json:"numCalls" ch:"numCalls"`
	Name         string  `json:"name" ch:"name"`
}

type TagFilters struct {
	TagKeys string `json:"tagKeys" ch:"tagKeys"`
}

type TagValues struct {
	TagValues string `json:"tagValues" ch:"tagValues"`
}

type ServiceMapDependencyResponseItem struct {
	Parent    string  `json:"parent" ch:"parent"`
	Child     string  `json:"child" ch:"child"`
	CallCount uint64  `json:"callCount" ch:"callCount"`
	CallRate  float64 `json:"callRate" ch:"callRate"`
	ErrorRate float64 `json:"errorRate" ch:"errorRate"`
	P99       float64 `json:"p99" ch:"p99"`
	P95       float64 `json:"p95" ch:"p95"`
	P90       float64 `json:"p90" ch:"p90"`
	P75       float64 `json:"p75" ch:"p75"`
	P50       float64 `json:"p50" ch:"p50"`
}

type GetFilteredSpansAggregatesResponse struct {
	Items map[int64]SpanAggregatesResponseItem `json:"items"`
}
type SpanAggregatesResponseItem struct {
	Timestamp int64              `json:"timestamp,omitempty" `
	Value     float32            `json:"value,omitempty"`
	GroupBy   map[string]float32 `json:"groupBy,omitempty"`
}
type SpanAggregatesDBResponseItem struct {
	Timestamp    int64     `ch:"timestamp" `
	Time         time.Time `ch:"time"`
	Value        uint64    `ch:"value"`
	FloatValue   float32   `ch:"floatValue"`
	Float64Value float64   `ch:"float64Value"`
	GroupBy      string    `ch:"groupBy"`
}

type SetTTLResponseItem struct {
	Message string `json:"message"`
}

type DiskItem struct {
	Name string `json:"name,omitempty" ch:"name"`
	Type string `json:"type,omitempty" ch:"type"`
}

type DBResponseTTL struct {
	EngineFull string `ch:"engine_full"`
}

type GetTTLResponseItem struct {
	MetricsTime             int    `json:"metrics_ttl_duration_hrs,omitempty"`
	MetricsMoveTime         int    `json:"metrics_move_ttl_duration_hrs,omitempty"`
	TracesTime              int    `json:"traces_ttl_duration_hrs,omitempty"`
	TracesMoveTime          int    `json:"traces_move_ttl_duration_hrs,omitempty"`
	ExpectedMetricsTime     int    `json:"expected_metrics_ttl_duration_hrs,omitempty"`
	ExpectedMetricsMoveTime int    `json:"expected_metrics_move_ttl_duration_hrs,omitempty"`
	ExpectedTracesTime      int    `json:"expected_traces_ttl_duration_hrs,omitempty"`
	ExpectedTracesMoveTime  int    `json:"expected_traces_move_ttl_duration_hrs,omitempty"`
	Status                  string `json:"status"`
}

type DBResponseServiceName struct {
	ServiceName string `ch:"serviceName"`
	Count       uint64 `ch:"count"`
}

type DBResponseHttpCode struct {
	HttpCode string `ch:"httpCode"`
	Count    uint64 `ch:"count"`
}

type DBResponseHttpRoute struct {
	HttpRoute string `ch:"httpRoute"`
	Count     uint64 `ch:"count"`
}

type DBResponseHttpUrl struct {
	HttpUrl string `ch:"httpUrl"`
	Count   uint64 `ch:"count"`
}

type DBResponseHttpMethod struct {
	HttpMethod string `ch:"httpMethod"`
	Count      uint64 `ch:"count"`
}

type DBResponseStatusCodeMethod struct {
	ResponseStatusCode string `ch:"responseStatusCode"`
	Count              uint64 `ch:"count"`
}

type DBResponseRPCMethod struct {
	RPCMethod string `ch:"rpcMethod"`
	Count     uint64 `ch:"count"`
}

type DBResponseHttpHost struct {
	HttpHost string `ch:"httpHost"`
	Count    uint64 `ch:"count"`
}

type DBResponseOperation struct {
	Operation string `ch:"name"`
	Count     uint64 `ch:"count"`
}

type DBResponseComponent struct {
	Component string `ch:"component"`
	Count     uint64 `ch:"count"`
}

type DBResponseTotal struct {
	NumTotal uint64 `ch:"numTotal"`
}

type SpanFiltersResponse struct {
	ServiceName        map[string]uint64 `json:"serviceName"`
	Status             map[string]uint64 `json:"status"`
	Duration           map[string]uint64 `json:"duration"`
	Operation          map[string]uint64 `json:"operation"`
	HttpCode           map[string]uint64 `json:"httpCode"`
	ResponseStatusCode map[string]uint64 `json:"responseStatusCode"`
	RPCMethod          map[string]uint64 `json:"rpcMethod"`
	HttpUrl            map[string]uint64 `json:"httpUrl"`
	HttpMethod         map[string]uint64 `json:"httpMethod"`
	HttpRoute          map[string]uint64 `json:"httpRoute"`
	HttpHost           map[string]uint64 `json:"httpHost"`
	Component          map[string]uint64 `json:"component"`
}
type Error struct {
	ExceptionType  string    `json:"exceptionType" ch:"exceptionType"`
	ExceptionMsg   string    `json:"exceptionMessage" ch:"exceptionMessage"`
	ExceptionCount uint64    `json:"exceptionCount" ch:"exceptionCount"`
	LastSeen       time.Time `json:"lastSeen" ch:"lastSeen"`
	FirstSeen      time.Time `json:"firstSeen" ch:"firstSeen"`
	ServiceName    string    `json:"serviceName" ch:"serviceName"`
	GroupID        string    `json:"groupID" ch:"groupID"`
}

type ErrorWithSpan struct {
	ErrorID             string    `json:"errorId" ch:"errorID"`
	ExceptionType       string    `json:"exceptionType" ch:"exceptionType"`
	ExceptionStacktrace string    `json:"exceptionStacktrace" ch:"exceptionStacktrace"`
	ExceptionEscaped    bool      `json:"exceptionEscaped" ch:"exceptionEscaped"`
	ExceptionMsg        string    `json:"exceptionMessage" ch:"exceptionMessage"`
	Timestamp           time.Time `json:"timestamp" ch:"timestamp"`
	SpanID              string    `json:"spanID" ch:"spanID"`
	TraceID             string    `json:"traceID" ch:"traceID"`
	ServiceName         string    `json:"serviceName" ch:"serviceName"`
	GroupID             string    `json:"groupID" ch:"groupID"`
}

type NextPrevErrorIDsDBResponse struct {
	NextErrorID   string    `ch:"nextErrorID"`
	NextTimestamp time.Time `ch:"nextTimestamp"`
	PrevErrorID   string    `ch:"prevErrorID"`
	PrevTimestamp time.Time `ch:"prevTimestamp"`
	Timestamp     time.Time `ch:"timestamp"`
}

type NextPrevErrorIDs struct {
	NextErrorID   string    `json:"nextErrorID"`
	NextTimestamp time.Time `json:"nextTimestamp"`
	PrevErrorID   string    `json:"prevErrorID"`
	PrevTimestamp time.Time `json:"prevTimestamp"`
	GroupID       string    `json:"groupID"`
}

type Series struct {
	QueryName string            `json:"queryName"`
	Labels    map[string]string `json:"metric"`
	Points    []MetricPoint     `json:"values"`
}

type MetricPoint struct {
	Timestamp int64
	Value     float64
}

// MarshalJSON implements json.Marshaler.
func (p *MetricPoint) MarshalJSON() ([]byte, error) {
	v := strconv.FormatFloat(p.Value, 'f', -1, 64)
	return json.Marshal([...]interface{}{float64(p.Timestamp) / 1000, v})
}

// MarshalJSON implements json.Marshaler.
func (s *ServiceItem) MarshalJSON() ([]byte, error) {
	// If a service didn't not send any data in the last interval duration
	// it's values such as 99th percentile will return as NaN and
	// json encoding doesn't support NaN
	// We still want to show it in the UI, so we'll replace NaN with 0
	type Alias ServiceItem
	if math.IsInf(s.AvgDuration, 0) || math.IsNaN(s.AvgDuration) {
		s.AvgDuration = 0
	}
	if math.IsInf(s.CallRate, 0) || math.IsNaN(s.CallRate) {
		s.CallRate = 0
	}
	if math.IsInf(s.ErrorRate, 0) || math.IsNaN(s.ErrorRate) {
		s.ErrorRate = 0
	}
	if math.IsInf(s.Percentile99, 0) || math.IsNaN(s.Percentile99) {
		s.Percentile99 = 0
	}

	return json.Marshal(&struct {
		*Alias
	}{
		Alias: (*Alias)(s),
	})
}
