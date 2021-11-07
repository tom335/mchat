defmodule MchatServer.Router do
  use Plug.Router
  require EEx

  plug Plug.Static,
    at: "/",
    from: :mchat_server
  plug :match
  plug Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  plug :dispatch
  
  # EEx.function_from_file(:defp, :application_html, "lib/application.html.eex", [])

  get "/" do
    conn = put_resp_content_type(conn, "text/html")
    send_file(conn, 200, "priv/static/index.html")
  end

  match _ do
    send_resp(conn, 404, "404")
  end
end
