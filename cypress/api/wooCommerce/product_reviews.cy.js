import tokenFixture from '../../fixtures/token.json'
import productReviewsFixture from '../../fixtures/productsReviews.json'
import statusFixture from '../../fixtures/status.json'
import reviewsPostSchema from '../../contracts/productReviews/reviewsPost.contracts'
import reviewsPutSchema from '../../contracts/productReviews/reviewsPut.contracts'
import reviewsDeleteSchema from '../../contracts/productReviews/reviewsDelete.contracts'
import { faker } from '@faker-js/faker'

var reviewer = faker.name.fullName()
var reviewer_email = faker.internet.email(reviewer)

describe('Product Reviews', () => {



  it('Listar product reviews', () => {

    cy.getProductReviewWooCommerce(tokenFixture.token).then((response) => {
      expect(response.body).to.exist
      expect(response.status).to.eq(statusFixture.ok)

    })
  })

  it('Criar product reviews', () => {

    cy.postProductReviewWooCommerce(
      tokenFixture.token,
      productReviewsFixture.productReviewsValido.product_id,
      productReviewsFixture.productReviewsValido.review,
      reviewer,
      reviewer_email,
      productReviewsFixture.productReviewsValido.rating,

    ).then((response) => {

      var id = response.body.id

      expect(response.status).to.eq(statusFixture.created)
      expect(response.body.product_id).to.eq(productReviewsFixture.productReviewsValido.product_id)
      expect(response.body.review).to.eq(productReviewsFixture.productReviewsValido.review)
      expect(response.body.reviewer).to.eq(reviewer)
      expect(response.body.reviewer_email).to.eq(reviewer_email)
      expect(response.body.rating).to.eq(productReviewsFixture.productReviewsValido.rating)
      return reviewsPostSchema.validateAsync(response.body),

        cy.deleteProductReviewWooCommerce(
          tokenFixture.token,
          id,
          productReviewsFixture.productReviewsDeletar.force
        )

    })
  })

  it('Editar product reviews', () => {

    cy.postProductReviewWooCommerce(
      tokenFixture.token,
      productReviewsFixture.productReviewsValido.product_id,
      productReviewsFixture.productReviewsValido.review,
      reviewer,
      reviewer_email,
      productReviewsFixture.productReviewsValido.rating,

    ).then((response) => {

      var id = response.body.id

      cy.putProductReviewWooCommerce(
        tokenFixture.token,
        productReviewsFixture.productReviewsEditar.product_id,
        productReviewsFixture.productReviewsEditar.review,
        reviewer,
        reviewer_email,
        productReviewsFixture.productReviewsEditar.rating,
        id
      )
    }).then((response) => {
      
      var id = response.body.id

      expect(response.status).to.eq(statusFixture.ok)
      expect(response.body.product_id).to.eq(productReviewsFixture.productReviewsEditar.product_id)
      expect(response.body.review).to.eq(productReviewsFixture.productReviewsEditar.review)
      expect(response.body.reviewer).to.eq(reviewer)
      expect(response.body.reviewer_email).to.eq(reviewer_email)
      expect(response.body.rating).to.eq(productReviewsFixture.productReviewsEditar.rating)
      return reviewsPutSchema.validateAsync(response.body),

        cy.deleteProductReviewWooCommerce(

          tokenFixture.token,
          id,
          productReviewsFixture.productReviewsDeletar.force

        )
    })
  })

  it('Deletar product reviews', () => {

    cy.postProductReviewWooCommerce(
      tokenFixture.token,
      productReviewsFixture.productReviewsValido.product_id,
      productReviewsFixture.productReviewsValido.review,
      reviewer,
      reviewer_email,
      productReviewsFixture.productReviewsValido.rating,

    ).then((response) => {

      var id = response.body.id

      cy.deleteProductReviewWooCommerce(
        tokenFixture.token,
        id,
        productReviewsFixture.productReviewsDeletar.force
      )

    }).then((response) => {

      expect(response.status).to.eq(statusFixture.ok)
      return reviewsDeleteSchema.validateAsync(response.body)

    })
  })

})
