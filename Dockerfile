FROM ruby:2.3

RUN bundle config mirror.https://rubygems.org https://gems.ruby-china.com

COPY ./Gemfile ./Gemfile

RUN bundle install && \
    rm ./Gemfile

WORKDIR /app