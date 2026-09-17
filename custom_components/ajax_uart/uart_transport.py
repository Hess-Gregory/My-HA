import asyncio
import serial_asyncio
from .parser import parse_line


class AjaxProtocol(asyncio.Protocol):
    def __init__(self, logger, on_event=None):
        self.transport = None
        self.logger = logger
        self._buf = ""
        self._on_event = on_event

    def connection_made(self, transport):
        self.transport = transport
        self.logger.info("✅ UART connected to Ajax UART")

        # Init commands
        self.send_cmd("ech 0")
        self.send_cmd("inf 1")
        self.send_cmd("ext 1")

    def data_received(self, data):
        chunk = data.decode(errors="ignore")
        self._buf += chunk
        while "\r\n" in self._buf:
            line, self._buf = self._buf.split("\r\n", 1)
            line = line.strip()
            if line:
                parsed = parse_line(line)
                self.logger.debug("RAW: %s | PARSED: %s", line, parsed)
                if self._on_event:
                    try:
                        self._on_event(parsed)
                    except Exception:  # pragma: no cover - defensive logging
                        self.logger.exception("Dispatcher error for line: %s", line)

    def connection_lost(self, exc):
        self.logger.warning("⚠️ UART disconnected: %s", exc)

    def send_cmd(self, cmd: str):
        if self.transport:
            self.logger.debug("➡️ TX: %s", cmd)
            self.transport.write((cmd + "\r\n").encode())


async def start_uart(loop, port, baudrate, logger, on_event=None):
    transport, protocol = await serial_asyncio.create_serial_connection(
        loop, lambda: AjaxProtocol(logger, on_event=on_event), port, baudrate=baudrate
    )
    return transport, protocol
