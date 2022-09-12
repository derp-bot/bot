package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/bwmarrin/discordgo"
)

type derpContextKey string

func main() {
  token := os.Getenv("DERP_BOT_TOKEN")
  if token == "" {
    log.Fatal("No DERP_BOT_TOKEN provided")
  }

  derp, err := discordgo.New("Bot " + token)
  if err != nil {
    log.Fatal(err)
  }

  ctx, cancel := context.WithCancel(context.WithValue(context.Background(), derpContextKey("session"), derp))
  defer cancel()

  initMonitors(ctx, derp)

  derp.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
    if m.Author.ID == s.State.User.ID {
      return
    }

    if m.Content == "ping" {
      s.ChannelMessageSend(m.ChannelID, "pong")
    }
  })

	derp.Identify.Intents = discordgo.IntentsAllWithoutPrivileged

  err = derp.Open()
  if err != nil {
    log.Fatal(err)
  }

  log.Println("Derp is alive!")

	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM, os.Interrupt, os.Kill)

	<-sc
}
