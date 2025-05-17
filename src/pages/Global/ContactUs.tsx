import Footer from "../../components/Footer/Footer";
import React from "react";
const ContactUs = () => {
  return (
    <>
      <div className="contact-us">
        <h2>About</h2>
        <p>
          Welcome to Treasure Hunt – the ultimate
          <br />
          playground for tech enthusiasts and problem solvers.
          <br />
          Dive into thrilling coding challenges,
          <br />
          compete with fellow developers, and climb
          <br />
          the leaderboard as you solve more challenges.
          <br />
          Whether you’re a beginner or a seasoned coder,
          <br />
          there’s always a challenge waiting for you.
          <br />
          Join the adventure and test your limits!
        </p>
        <div>
          <h2>Rules</h2>
          <ul>
            <li>
              <strong>Fair Play:</strong> No use of automated tools or unfair
              advantages.
            </li>
            <li>
              <strong>Time Limits:</strong> Each challenge has a specified time
              limit: submissions after the deadline won’t be accepted.
            </li>
            <li>
              <strong>Originality:</strong> Submit your original code.
              Plagiarism will lead to disqualification.
            </li>
            <li>
              <strong>Respect Others:</strong> Maintain a positive and
              respectful environment in discussions and competitions.
            </li>
            <li>
              <strong>Multiple Attempts:</strong> You can attempt challenges
              multiple times, but only the highest score will be recorded.
            </li>
          </ul>
        </div>
        <div>
          <h2>FAQ</h2>

          <ol>
            <li>
              <strong>How do I join the Treasure Hunt?</strong>
            </li>
            <ul>
              <li>
                Simply sign up and join a hunt then start solving challenges. No
                prior experience is required!.
              </li>
            </ul>
            <li>
              <strong>Is there a cost to participate?</strong>
            </li>
            <ul>
              <li>No, Treasure Hunt is completely free to join.</li>
            </ul>
            <li>
              <strong>Can I compete with my friends?</strong>
            </li>
            <ul>
              <li>Yes! Invite your friends and compete on the leaderboard.</li>
            </ul>
            <li>
              <strong> How is the scoring calculated?</strong>
            </li>

            <ul>
              <li>
                Scores are based on accuracy and speed. The faster and more
                correct your solutions, the higher you rank.
              </li>
            </ul>
            <li>
              <strong>What if I get stuck on a challenge?</strong>
            </li>
            <ul>
              <li>
                You can revisit the challenge anytime or check out community
                hints in the forums.
              </li>
            </ul>
            <li>
              <strong>Are there prizes for winning?</strong>
            </li>

            <ul>
              <li>
                Top performers receive badges and certificates. Special events
                may include additional prizes!
              </li>
            </ul>
          </ol>
        </div>

        <div>
          <h2>Contact Us</h2>
          <p>
            <a href="#" className="social-link">
              Facebook
            </a>{" "}
            |
            <a href="#" className="social-link">
              Twitter
            </a>{" "}
            |
            <a href="#" className="social-link">
              Instagram
            </a>
          </p>
        </div>
        <div>
          <Footer />{" "}
        </div>
      </div>
    </>
  );
};
export default ContactUs;
