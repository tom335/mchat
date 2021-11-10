defmodule MchatServer.SocketHandler do
  defmacro __using__(_opts) do
    quote do
      @behaviour :cowboy_websocket
      require Logger

      @callback handle_message(String.t()) :: {:ok, term}

      def init(request, state) do
        {:cowboy_websocket, request, state}
      end

      def websocket_init(state) do
        {:ok, state}
      end

      @doc """
      Handle incoming websocket messages.

      Notice the {_frame, state} signature below which
      also handles incoming {:ping, "PING"} frames

      From https://ninenines.eu/docs/en/cowboy/2.6/guide/ws_handlers/:

        "... ping and pong frames require no action from the handler
         as Cowboy will automatically reply to ping frames ... "

      """
      def websocket_handle({:text, json}, state) do
        Logger.info(json)
        Logger.info("websocket_handle :: calling handle_message callback")
        handle_message(json)

        {:reply, {:text, json}, state}
      end

      def websocket_handle(_frame, state) do
        Logger.info("websocket_handle :: ping")
        {:ok, state}
      end

      def websocket_info(info, state) do
        Logger.info("websocket_info :: message :: " <> info)
        m = Jason.encode!(%{message: info})

        {:reply, {:text, m}, state}
      end
    end
  end
end
