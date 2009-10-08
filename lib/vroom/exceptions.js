function create(type, status) {
  var exc = function (msg) {
    var e = {};
    e.type = type;
    e.status = status;
    e.message = msg || type;
    return e;
  };
  
  exc.type = type;
  exc.status = status;
  exc.message = type;
  
  exports[type] = exc;
  if (!exports[status]) {
    exports[status] = exc;
  }
}

var exs = [
  create("Informational", "1xx"),
    create("Continue",                      100),
    create("SwitchingProtocols",            101),
  
  create("Successful", "2xx"),
    create("OK",                            200),
    create("Created",                       201),
    create("Accepted",                      202),
    create("NonAuthoritativeInformation",   203),
    create("NoContent",                     204),
    create("ResetContent",                  205),
    create("PartialContent",                206),
  
  create("Redirection", "3xx"),
    create("MultipleChoices",               300),
    create("MovedPermanently",              301),
    create("MovedTemporarily",              302),
    create("SeeOther",                      303),
    create("NotModified",                   304),
    create("UseProxy",                      305),
    create("TemporaryRedirect",             307),
  
  create("ClientError", "4xx"),
    create("BadRequest",                    400),
      create("MultiPartParseError",         400),
  
    create("Unauthorized",                  401),
    create("PaymentRequired",               402),
    create("Forbidden",                     403),
    create("NotFound",                      404),
    create("ControllerNotFound",            404),
    create("ActionNotFound",                404),
    create("TemplatenNotFound",             404),
    create("LayoutNotFound",                404),
  
    create("MethodNotAllowed",              405),
    create("ProxyAuthenticationRequired",   406),
    create("RequestTimeout",                408),
    create("Conflict",                      409),
    create("Gone",                          410),
    create("LengthRequired",                411),
    create("PreconditionFailed",            412),
    create("RequestEntityTooLarge",         413),
    create("RequestURITooLarge",            414),
    create("UnsupportedMediaType",          415),
    create("RequestRangeNotSatisfiable",    416),
    create("ExpectationFailed",             417),
  
  create("ServerError", "5xx"),             
    create("InternalServerError",           500),
      create("TemplateError",               500),
    create("NotImplemented",                501),
    create("BadGateway",                    502),
    create("ServiceUnavailable",            503),
    create("GatewayTimeout",                504),
    create("HTTPVersionNotSupported",       505)
];
