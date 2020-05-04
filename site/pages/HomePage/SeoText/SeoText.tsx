import React from 'react'

import s from './SeoText.scss'


const SeoText = () => (
  <div>
    <div className={s.content}>
      <p className={s.text}>
        Currently, we are all looking for ways to take all this free time at home in front of us. From development with free instructions on the Internet to the provision of streaming services, a huge push, quarantine has proven that the Internet and other technologies are here to stay for more than a long time.
      </p>

      <h2 className={s.title}>The board game CodeNames online</h2>
      <p className={s.text}>
        <strong>CodeNames</strong> is a <strong>Board game</strong>, invented by Vladej Grafil, first published in 2015 by Czech Games Edition. In Russia it is localized by Gaga Games and is known as CodeNames: code name.
        The game received the following awards: nominee of the Origs Awards Best family game (2016), nominee Of the best family game in Germany (2016), nominee of the SXSW Board game of the year award (2016), winner of Major Fun! Award (2015), Dice Tower quality mark (2015), winner of The best family game of the year by BGG Golden Geek Award (2015), winner of the Best party game of the year by BGG Golden Geek Award (2015).
        At the time of writing CodeNames is ranked 17th in the international ranking of Board games and 1st among party games according to the site <a href="https://codenames.wtf">codenames.wtf</a>. It is noteworthy that party games have never been in the world's TOP 20 before.
        The game has been translated into 20 languages (English, Czech, Danish, French, Hungarian, Dutch, Italian, Catalan, Korean, German, Norwegian, Polish, Portuguese, Romanian, Slovak, Spanish, Swedish, Japanese, and Russian).
      </p>

      <h2 className={s.title}>Game rules</h2>
      <p className={s.text}>
        The <strong>board game</strong> is a verbal and team competition. Players are divided into two teams. A field of 25 random words is laid out in front of the players. Each word corresponds to a secret agent of a particular team (red or blue), a civilian or a killer. The captains of the two teams take turns voicing a hint for their players to lead them to words that match their agents.
      </p>

      <h2 className={s.title}>Game goal</h2>
      <p className={s.text}>
        Guess all your agents before the enemy team does, and not meet the killer.
      </p>

      <h2 className={s.title}>Team move</h2>
      <p className={s.text}>
        The team captain looks at the key card and sees which of the 25 cards spread out on the table refer to their agents, which to civilians, and which card indicates the killer in this batch. After that, he gives his players a hint in the form of a single word and a single digit, which indicates the number of cards United by this word.
        Players confer and choose the one word that they think best fits the hint. If they guess correctly, the captain puts an agent card of their own color on this word, and the players continue to guess the words. If the selected card turns out to be a civilian, the move goes to the opposing team. If the selected card turns out to be an agent of the opponents, then the move goes to them and they get this word as guessed. If the team meets the killer, it immediately loses.
      </p>

      <h2 className={s.title}>Game end</h2>
      <p className={s.text}>
        The <strong>game</strong> ends with the victory of one of the teams if the team correctly guesses all its agents or the opposing team faces the killer.
      </p>
    </div>
  </div>
)


export default SeoText
