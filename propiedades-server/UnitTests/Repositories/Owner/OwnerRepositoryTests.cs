using Application.DTOs;
using Domain.Models;
using Infraestructure.Persistence.Services;
using MongoDB.Driver;
using Moq;

namespace UnitTests.Repositories
{
    [TestFixture]
    public class OwnerRepositoryTests
    {

        private Mock<IMongoCollection<Owner>> _mockCollection;
        private OwnerRepository _ownerRepository;

        [SetUp]
        public void Setup()
        {
            // Configurar los mocks
            _mockCollection = new Mock<IMongoCollection<Owner>>();

            // Crear la instancia del servicio
            _ownerRepository = new OwnerRepository(_mockCollection.Object);
        }

        [Test]
        public async Task GetAsync_ShouldReturnAllBooks()
        {
            // Arrange
            var expectedOwners = new List<Owner>
            {
                new Owner {
                    IdOwner = "1",
                    OwnerName = "Juan Pérez",
                    DNI = "12345678A",
                    Phone = "+573213334444",
                    Email = "test@example.com",
                    Address = "Calle falsa 1-23",
                    Photo = "image url",
                    Birthday = "1990-01-01",
                    CreatedAt = DateTime.UtcNow
                },
                new Owner {
                    IdOwner = "1",
                    OwnerName = "María García",
                    DNI = "87654321B",
                    Phone = "+573213334444",
                    Email = "test@example.com",
                    Address = "Calle falsa 1-23",
                    Photo = "image url",
                    Birthday = "1990-01-01",
                    CreatedAt = DateTime.UtcNow
                },
                new Owner {
                    IdOwner = "1",
                    OwnerName = "Carlos López",
                    DNI = "11111111C",
                    Phone = "+573213334444",
                    Email = "test@example.com",
                    Address = "Calle falsa 1-23",
                    Photo = "image url",
                    Birthday = "1990-01-01",
                    CreatedAt = DateTime.UtcNow
                },
            };

            var mockCursor = new Mock<IAsyncCursor<Owner>>();
            mockCursor.Setup(c => c.Current).Returns(expectedOwners);
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                     .Returns(true)
                     .Returns(false);
            mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                     .ReturnsAsync(true)
                     .ReturnsAsync(false);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Owner>>(),
                It.IsAny<FindOptions<Owner>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockCursor.Object);

            // Act
            var result = await _ownerRepository.GetAllAsync();

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.Count, Is.EqualTo(3));
            Assert.That(result[0].OwnerName, Is.EqualTo("Juan Pérez"));
            Assert.That(result[1].OwnerName, Is.EqualTo("María García"));
        }

        [Test]
        public async Task GetAsync_WithId_ShouldReturnBook_WhenBookExists()
        {
            // Arrange
            var idOwner = "507f1f77bcf86cd799439011";
            var expectedOwner = new Owner
            {
                IdOwner = idOwner,
                OwnerName = "Juan Pérez",
                DNI = "12345678A",
                Phone = "+573213334444",
                Email = "test@example.com",
                Address = "Calle falsa 1-23",
                Photo = "image url",
                Birthday = "1990-01-01",
                CreatedAt = DateTime.UtcNow
            };

            var mockCursor = new Mock<IAsyncCursor<Owner>>();
            mockCursor.Setup(c => c.Current).Returns(new List<Owner> { expectedOwner });
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                     .Returns(true)
                     .Returns(false);
            mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                     .ReturnsAsync(true)
                     .ReturnsAsync(false);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Owner>>(),
                It.IsAny<FindOptions<Owner>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockCursor.Object);

            // Act
            var result = await _ownerRepository.GetOneByIdAsync(idOwner);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.IdOwner, Is.EqualTo(idOwner));
            Assert.That(result.OwnerName, Is.EqualTo("Juan Pérez"));
        }

        [Test]
        public async Task CreateAsync_ShouldInsertBook()
        {
            // Arrange
            var newOwner = new OwnerDTO
            {
                IdOwner = "2",
                OwnerName = "Juan Pérez",
                DNI = "12345678A",
                Phone = "+573213334444",
                Email = "test@example.com",
                Address = "Calle falsa 1-23",
                Photo = "image url",
                Birthday = "1990-01-01",
                CreatedAt = DateTime.Now
            };


            var mockCursor = new Mock<IAsyncCursor<Owner>>();
            mockCursor.Setup(c => c.Current).Returns(new List<Owner> { });
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                     .Returns(true)
                     .Returns(false);
            mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                     .ReturnsAsync(true)
                     .ReturnsAsync(false);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Owner>>(),
                It.IsAny<FindOptions<Owner>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockCursor.Object);

            // Act
            await _ownerRepository.CreateAsync(newOwner);

            // Assert
            _mockCollection.Verify(
                c => c.InsertOneAsync(
                    It.Is<Owner>(b => b.IdOwner == null
                                  && b.OwnerName == newOwner.OwnerName
                                  && b.DNI == newOwner.DNI
                                  && b.Phone == newOwner.Phone
                                  && b.Email == newOwner.Email
                                  && b.Address == newOwner.Address
                                  && b.Photo == newOwner.Photo
                                  && b.Birthday == newOwner.Birthday
                                  && b.CreatedAt == newOwner.CreatedAt),
                    null,
                    default(CancellationToken)),
                Times.Once);
        }

        [Test]
        public async Task UpdateAsync_ShouldReplaceBook()
        {
            var updatedOwner = new OwnerDTO
            {
                IdOwner = "507f1f77bcf86cd799439011",
                OwnerName = "Juan Pérez",
                DNI = "12345678A",
                Phone = "+573213334444",
                Email = "test@example.com",
                Address = "Calle falsa 1-23",
                Photo = "image url",
                Birthday = "1990-01-01",
                CreatedAt = DateTime.Now
            };

            _mockCollection.Setup(c => c.UpdateOneAsync(
                It.IsAny<FilterDefinition<Owner>>(),
                It.IsAny<UpdateDefinition<Owner>>(),
                It.IsAny<UpdateOptions>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(new UpdateResult.Acknowledged(1, 1, null));

            // Act
            await _ownerRepository.UpdateAsync(updatedOwner);

            // Assert
            _mockCollection.Verify(
                    c => c.UpdateOneAsync(
                        It.IsAny<FilterDefinition<Owner>>(),
                        It.IsAny<UpdateDefinition<Owner>>(),
                        null,
                        default(CancellationToken)),
                    Times.Once);
        }

        [Test]
        public async Task RemoveAsync_ShouldDeleteBook()
        {
            // Arrange
            var IdOwner = "507f1f77bcf86cd799439011";

            var mockCursor = new Mock<IAsyncCursor<Owner>>();
            mockCursor.Setup(c => c.Current).Returns(new List<Owner> { });
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                     .Returns(true)
                     .Returns(false);
            mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                     .ReturnsAsync(true)
                     .ReturnsAsync(false);

            _mockCollection.Setup(c => c.DeleteOneAsync(
                It.IsAny<FilterDefinition<Owner>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(new DeleteResult.Acknowledged(1));

            // Act
            await _ownerRepository.RemoveAsync(IdOwner);

            // Assert
            _mockCollection.Verify(
                c => c.DeleteOneAsync(
                    It.IsAny<FilterDefinition<Owner>>(),
                    default(CancellationToken)),
                Times.Once);
        }

        [Test]
        public async Task GetAsync_WithDNI_ShouldReturnBook_WhenBookExists()
        {
            // Arrange
            var DNI = "12345678A";
            var expectedOwner = new Owner
            {
                IdOwner = "507f1f77bcf86cd799439011",
                OwnerName = "Juan Pérez",
                DNI = DNI,
                Phone = "+573213334444",
                Email = "test@example.com",
                Address = "Calle falsa 1-23",
                Photo = "image url",
                Birthday = "1990-01-01",
                CreatedAt = DateTime.Now
            };

            var mockCursor = new Mock<IAsyncCursor<Owner>>();
            mockCursor.Setup(c => c.Current).Returns(new List<Owner> { expectedOwner });
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<CancellationToken>()))
                     .Returns(true)
                     .Returns(false);
            mockCursor.SetupSequence(c => c.MoveNextAsync(It.IsAny<CancellationToken>()))
                     .ReturnsAsync(true)
                     .ReturnsAsync(false);

            _mockCollection.Setup(c => c.FindAsync(
                It.IsAny<FilterDefinition<Owner>>(),
                It.IsAny<FindOptions<Owner>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockCursor.Object);

            // Act
            var result = await _ownerRepository.GetOneByDNIAsync(DNI);

            // Assert
            Assert.That(result, Is.Not.Null);
            Assert.That(result.DNI, Is.EqualTo(DNI));
            Assert.That(result.OwnerName, Is.EqualTo("Juan Pérez"));
        }

    }
}